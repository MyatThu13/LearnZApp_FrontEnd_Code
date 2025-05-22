import { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/functions";
import { STRINGS } from "../constant";
import { IMAGES } from "../assets";
import { PremiumView, LAWarningPopup, VolumeLicensingBanner } from "../components";
import {
  UPLOAD_PROFILE,
} from "../api/firebase_user";
import { RESET_USER_QUESTIONS_COLLECTION } from "../api/questions";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/config";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { IS_BUNDLE_APP, STRING } from "../../app_constant";
import { SHOW_TOAST } from "../constant/utils";
import { MixpanelContext } from "../context/MixpanelProvider";
import SupportEmailForm from "../components/SupportEmailForm";

function Profile() {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCameraView, setIsCameraView] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [image, setImage] = useState(null);
  const [isImagePicker, setImagePicker] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const { theme } = useContext(ThemeContext);
  const [customerPortalLink, setCustomerPortalLink] = useState(null);
  
  const fileInputRef = useRef(null);


  const {
    bundleData,
    profile,
    setProfilePicture,
    setBundleProfilePicture,
    setNewProfile,
    setBundleProfile,
    isSubscribe,
  } = useContext(AuthContext);
  const { trackAccountSetting, trackResetApp, trackReviewApp } =
    useContext(MixpanelContext);
  const { resetMixpanel } = useContext(MixpanelContext);

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  console.log("bundleData", bundleData)

  async function onSignOut() {
    setLoading(true);
    await auth().signOut();
    setLoading(false);
    resetMixpanel();
    navigation("/login");
    localStorage.removeItem("appState");
  }

  function getUserImage() {
    if (tempImage) {
      setImage(tempImage);
    } else if (IS_BUNDLE_APP && bundleData?.profile_pic) {
      setImage(bundleData.profile_pic);
    } else if (IS_BUNDLE_APP == false && profile?.profile_pic) {
      setImage(profile?.profile_pic);
    } else {
      setImage(IMAGES.ic_user_home);
    }
  }

  const getBundleDetails = async () => {
    try {
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBundleDetails();
  }, []);

  useEffect(() => {
    getUserImage();
  }, [profile, bundleData]);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = async (e) => {
    let file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      fileInputRef.current.value = null;
      setTempImage(imageUrl);
      setImage(imageUrl);
      setImagePicker(false);
      const result = await UPLOAD_PROFILE(file);
      setLoading(false);
      if (result.status) {
        if (IS_BUNDLE_APP) {
          setBundleProfilePicture(result.url);
        } else {
          setProfilePicture(result.url);
        }
      } else {
        SHOW_TOAST(result.error ?? "");
      }
    }
  };

  function getPlanExpiry() {
    const profile_expiry = profile?.subscription?.subscription_expiration;
    const bundle_expiry = bundleData?.subscription?.subscription_expiration;
    
    const formatDateIfValid = (expiry) => {
        const expiryDate = moment(parseInt(expiry ?? "0"));
        return expiryDate.isAfter(moment()) ? expiryDate.format("DD MMM, YYYY hh:mm a") : null;
    };
    
    if (IS_BUNDLE_APP) {
        if (bundle_expiry) {
            return formatDateIfValid(bundle_expiry);
        } else if (profile_expiry) {
            return formatDateIfValid(profile_expiry);
        } else {
            return null;
        }
    } else {
        if (profile_expiry) {
            return formatDateIfValid(profile_expiry);
        } else {
            return null;
        }
    }
}


  async function resetData() {
    await RESET_USER_QUESTIONS_COLLECTION();
    const data = {
      auth_first_name: profile?.auth_first_name ?? "",
      auth_last_name: profile?.auth_last_name ?? "",
      auth_email: profile?.auth_email ?? "",
      auth_login_provider: profile?.auth_login_provider ?? "",
      last_signin_time: IS_BUNDLE_APP
        ? profile?.last_signin_time ?? ""
        : auth().currentUser.metadata?.lastSignInTime ?? "",
      flashcard_bookmarks: [],
      flashcards_progress: [],
      practice_test_history: [],
      question_bookmarks: [],
      questions_progress: [],
      quiz_of_the_day_reminder: true,
      signup_date: IS_BUNDLE_APP
        ? profile?.signup_date ?? ""
        : auth().currentUser.metadata?.creationTime ?? "",
      study_plan_reminder: true,
      profile_pic: "",
      readiness_scores: null,
      score_progress: {},
      ...(profile?.isQuestionLatestVersionUpdated !== undefined && { isQuestionLatestVersionUpdated: profile.isQuestionLatestVersionUpdated }),
    };
    setNewProfile(data);
    if (IS_BUNDLE_APP) {
      const dataBundle = {
        auth_first_name: bundleData?.auth_first_name ?? "",
        auth_last_name: bundleData?.auth_last_name ?? "",
        auth_email: bundleData?.auth_email ?? "",
        auth_login_provider:
          auth().currentUser?.providerData[0]?.providerId ?? "",
        last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
        signup_date: auth().currentUser.metadata?.creationTime ?? "",
        profile_pic: "",
      };
      setBundleProfile(dataBundle);
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      moveToHome();
    }, 1000);
  }

  async function moveToHome() {
    navigation();
    navigation("/prepare", {
      state: {
        isFromOnboarding: true,
      },
    });
  }


  /* useEffect(() => {
    const fetchCustomerPortalLink = async () => {
      try {
        const functionRef = firebase
          .app()
          .functions("us-central1")
          .httpsCallable("ext-firestore-stripe-payments-createPortalLink");
        const { data } = await functionRef({
          returnUrl: `${window.location.origin}/prepare`,
          locale: "auto",
        });
        setCustomerPortalLink(data.url);
      } catch (error) {
        console.error("Error fetching customer portal link:", error);
      }
    };
    if (isSubscribe) {
      fetchCustomerPortalLink();
    }
  }, []); */

  const handleFetchCustomerPortalLink = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const functionRef = firebase
        .app()
        .functions("us-central1")
        .httpsCallable("ext-firestore-stripe-payments-createPortalLink");
      const { data } = await functionRef({
        returnUrl: `${window.location.origin}/prepare`,
        locale: "auto",
      });
      setCustomerPortalLink(data.url);
      setLoading(false);
      window.open(data.url, "_blank");
    } catch (error) {
      console.error("Error fetching customer portal link:", error);
      setLoading(false);
    }
  };



  useEffect(() => {
  }, []);

  const handleSharing = async () => {
    if (navigator.share) {
      try {
        await navigator
          .share({
            url: "https://isc2-learnzapp.web.app",
            title: "ISC2 Official App",
            text: "https://isc2-learnzapp.web.app",
          })
          .then(() =>
            console.log("Hooray! Your content was shared to tha world")
          );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      console.log(
        "Web share is currently not supported on this browser. Please provide a callback"
      );
    }
  };

  const expiryDate = getPlanExpiry();

  
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={image}
                alt="profile pic"
                className="w-32 h-32 bg-gray-400 rounded-full"
              />
              <div className="absolute bottom-0 right-0 bg-slate-300 h-8 w-8 rounded-full flex items-center justify-center">
                <button onClick={() => setImagePicker(true)}>
                  <img src={IMAGES?.ic_camera} />
                </button>
              </div>
            </div>
            <div className="ml-6">
              <div className="flex items-center">
                <span className="text-lg font-medium text-gray-800 dark:text-gray-50">
                  {IS_BUNDLE_APP
                    ? bundleData?.auth_first_name ?? ""
                    : profile?.auth_first_name ?? ""}
                </span>
                &nbsp;
                <span className="text-lg font-medium text-gray-800 dark:text-gray-50">
                  {IS_BUNDLE_APP
                    ? bundleData?.auth_last_name ?? ""
                    : profile?.auth_last_name ?? ""}
                </span>
              </div>
              <p className="text-xl font-medium text-gray-800 dark:text-gray-50">
                {IS_BUNDLE_APP ? bundleData?.auth_email ?? "" : profile?.auth_email ?? ""}
              </p>
              {expiryDate ? (
                <>
                  <span className="text-base font-light text-gray-600 dark:text-gray-200">
                    {STRING.premium_member}
                  </span>
                  {expiryDate && (
                    <p className="text-base my-4 font-light text-gray-800 dark:text-gray-50">
                      {bundleData?.subscription?.paymentType === "recurring"
                        ? "Subscription renews on:"
                        : "Premium access expires on:"}
                      <span className="font-bold"> {expiryDate} </span>
                    </p>
                  )}
                  {bundleData?.subscription?.paymentType === "recurring" && (
                    <div className="mt-2">
                    {loading ? (
                      <div className="text-blue-600 font-semibold text-sm">
                        Loading...
                      </div>
                    ) : (
                      <a
                        href={customerPortalLink || "#"}
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        onClick={handleFetchCustomerPortalLink}
                      >
                        Manage Subscription
                      </a>
                    )}
                  </div>
                  )}
                </>
              ) : (
                <div className="mt-2">
                  <p className="text-base text-lz-orange">{STRINGS.free_member}</p>
                </div>
              )}
            </div>
          </div>
          
            {!expiryDate ? (
              <div
              className="rounded-2xl mt-12 bg-lz-blue-1 dark:bg-lz-blue-10 p-4 mr-2 text-white"
            >
              <PremiumView isProfile={true} theme={theme} />
            </div>
            ) : (
              <div className="mt-12">
                <VolumeLicensingBanner />
              </div>
            )}
          
          <div className="flex flex-col items-center mt-6 gap-2">
            <button
              onClick={onSignOut}
              className="border-2 text-gray-800 dark:text-gray-100 py-2 px-6 rounded-full transition-colors duration-300 w-1/2 text-sm"
            >
              <span className="text-sm font-normal">{STRINGS.sign_out}</span>
            </button>
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 gap-6">
          <div className="flex flex-col overflow-y-auto max-h-screen pb-6 pr-6">
            {[
              { name: "Account Setting", icon: IMAGES?.ic_account },
              { name: "Settings", icon: IMAGES?.ic_subscription },
              { name: "Reset App Data", icon: IMAGES?.ic_reset },
              { name: "Other Apps", icon: IMAGES?.ic_other_app },
              { name: "Got Questions? Contact Support", icon: IMAGES?.ic_email },
            ].map((e, index) => {
              return (
                <ProfileItem
                  key={index}
                  item={e?.name}
                  icon={e?.icon}
                  onClick={() => {
                    if (index === 0) {
                      trackAccountSetting();
                      navigation("/account");
                    } else if (index === 1) {
                      navigation("/testSetting");
                    } else if (index === 2) {
                      trackResetApp();
                      setIsReset(true);
                    } else if (index === 3) {
                      navigation("/otherApps");
                    } else if (index === 4) {
                      trackReviewApp();
                      //navigation("/helpAndSupport");
                      handleOpenDialog();
                    } else if (index === 5) {
                      handleSharing();
                      /* trackShareApp();
                      onShare(); */
                    }
                  }}
                />
              );
            })}
          </div>

          <div className="p-2 w-full max-w-2xl m-6">

          {isDialogOpen && (
        <SupportEmailForm
          handleCloseDialog={handleCloseDialog}
          isLoading={false}
          setLoading={() => {}}
        />
      )}

          </div>
        </div>
      </div>
      {isReset && (
        <LAWarningPopup
          onCancle={() => {
            setIsReset(false);
          }}
          onPress={(e, index) => {
            if (index === 0) {
              setIsReset(false);
            } else {
              resetData();
            }
          }}
          options={[STRINGS.no, STRINGS.reset]}
          title={STRINGS.reset_data}
          desc={STRINGS.reset_data_message}
        />
      )}
      {isImagePicker && (
        <LAWarningPopup
          setIsCameraView={setIsCameraView}
          setImagePicker={setImagePicker}
          setImage={setImage}
          isCameraView={isCameraView}
          iconHide={true}
          image={IMAGES.ic_camera}
          cancelText={STRING?.cancel}
          options={["Cancel", STRINGS?.camera, STRINGS?.photo_library]}
          onCancle={() => {
            setImagePicker(false);
          }}
          onPress={async (index) => {
            if (index === "Camera") {
              setIsCameraView(true);
            } else if (index === "Photo Library") {
              handleFileUpload();
            } else if (index === "Cancel") {
              setImagePicker(false);
            }
          }}
        />
      )}
      <input
        accept="image/*"
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileSelected(e)}
      />
    </div>
  );
}

function ProfileItem({ item, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-4 py-2 m-2 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-lz-blue-1 dark:hover:bg-gray-700 transition-colors duration-300 rounded-lg"
    >
      <div className="bg-white h-10 w-10 md:h-12 md:w-12 rounded-md border flex items-center justify-center">
        <img className="h-7 w-auto" src={icon} alt={item} />
      </div>
      <span className="flex-1 mx-3 text-base font-medium ">{item}</span>
      <span className="text-base font-semibold">{'❯'}</span>
    </div>
  );
}

export default Profile;
