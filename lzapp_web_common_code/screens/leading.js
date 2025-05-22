import { useContext, useEffect, useState } from "react";

//ASSETS
import { IMAGES } from "../assets";

//PACKAGES
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useNavigate } from "react-router-dom";

//COMPONENTS
import { LAButton, LAText, LAView } from "../components";

//CONSTANT
import { STRINGS, Tutorials } from "../constant";
import { SIGN_IN_GOOGLE, SIGN_UP_APPLE } from "../api/firebase_auth";
import { SHOW_TOAST, detectOS } from "../constant/utils";
import { MixpanelContext } from "../context/MixpanelProvider";
import { STRING } from "../../app_constant";
import ReviewPopup from "../components/ReviewPopup";
import LAInfoModal from "../components/LAInfoModal";
import { auth } from "../api/config";

function Leading() {
  console.log("Component is rendering");
  const [user, setUser] = useState(null);
  const [os, setOs] = useState("");

  const { trackOnboardingScreenView, trackOnboardingSingup } =
    useContext(MixpanelContext);
  const navigation = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribeAuth();
  }, []);

  // useEffect(() => {
  //   if (user) {
  //     navigation("/home");
  //   } else {
  //     navigation("/");
  //   }
  // }, [user]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingState, setLeadingState] = useState({ isLoading: false });
  const [isInfoMessage, setInfoMessage] = useState(false);

  useEffect(() => {
    console.log("Calling trackOnboardingScreenView with selectedIndex:", selectedIndex);
    trackOnboardingScreenView(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    console.log("Calling trackOnboardingScreenView with 0");
    trackOnboardingScreenView(0);
  }, []);
  useEffect(() => {
    const detectedOs = detectOS();
    console.log("Detected OS:", detectedOs);
    setOs(detectedOs);
  }, []);

  const signInWithGoogleHandler = async () => {
    trackOnboardingSingup('Google')
    setLeadingState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_IN_GOOGLE();
    setLeadingState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "google");
      // navigation("/home");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  const signInWithAppleHandler = async () => {
    trackOnboardingSingup('Apple')
    setLeadingState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_UP_APPLE();
    setLeadingState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "apple");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  async function moveToPrepare(result, type) {
    let firstName = result?.additionalUserInfo.profile?.given_name ?? "";
    let lastName = result?.additionalUserInfo.profile?.family_name ?? "";

    if (result?.firstName) {
      firstName = result?.firstName;
      lastName = result?.lastName;
    }
    navigation("/prepare", {
      state: {
        params: {
          firstName: firstName,
          lastName: lastName,
          isFromOnboarding: true,
          isFromLoginSignup: true,
          type: type,
        },
      },
    });
  }

  
  /* function detectOS() {
    const platform = navigator.platform;
    if (platform.indexOf("Win") !== -1) return "Windows";
    if (platform.indexOf("Mac") !== -1) return "Mac OS";
    if (platform.indexOf("Linux") !== -1) return "Linux";
    if (platform.indexOf("iPhone") !== -1) return "iOS";
    if (platform.indexOf("Android") !== -1) return "Android";
    if (platform.indexOf("iPad") !== -1) return "iPad";
    return "Unknown";
  } */
  return (
    <LAView
      type="full-screen"
      background="tutorial"
      className="grid grid-cols-12"
    >
      <LAView
        type="full-element-center"
        className={"col-span-12 md:col-span-6"}
      >
        <LAView type="full-element-center">
          <LAView className="w-[70%]">
            <Carousel
              showArrows={false}
              showThumbs={false}
              showIndicators={false}
              showStatus={false}
              width={"100%"}
              selectedItem={selectedIndex}
              onClickItem={(index) => {}}
            >
              {Tutorials.map((e, idx) => {
                return <img key={idx} src={e.image} />;
              })}
            </Carousel>
          </LAView>
        </LAView>
      </LAView>
      <div className="absolute lg:top-[50%] lg:right-[48%] md:top-[50%] md:right-[48%] sm:top-[47%] sm:right-[48%] top-[47%] right-[48%]  z-50 lg:h-20 lg:w-20 md:h-20 md:w-20  sm:h-16  sm:w-16 h-16 w-16 border-8 border-[#FAF1ED] bg-white rounded-full">
        <div className="flex items-center justify-center w-full h-full">
          <p>
            <span className="lg:text-xl lg:font-bold md:text-base md:font-medium sm:text-base sm:font-medium text-base font-medium">
              {selectedIndex + 1}/
            </span>{" "}
            5
          </p>
        </div>
      </div>
      <LAView
        type="full-element-center"
        flex="col"
        background="regular"
        className={
          "col-span-12 md:col-span-6 px-[16px] sm:px-[32px] lg:px-[64px] py-[10px] md:py-[30px]"
        }
      >
        <LAView className="w-full">
          <Carousel
            showArrows={false}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            width={"100%"}
            selectedItem={selectedIndex}
          >
            {Tutorials.map((e, idx) => {
              return (
                <div key={idx}>
                  <LAText
                    className="text-center"
                    size="large"
                    font="600"
                    color={"black"}
                    title={e.title}
                  />
                  <LAText
                    className="mt-6 text-center"
                    size="small"
                    font="500"
                    color={"gray"}
                    title={e.description}
                  />
                </div>
              );
            })}
          </Carousel>
        </LAView>
        <LAView flex="row" className="w-full flex justify-between my-3 md:my-6">
          <button>
            <LAView
              flex="row"
              className="flex items-center"
              onClick={() => {
                if (selectedIndex > 0) {
                  const index = selectedIndex - 1;
                  setSelectedIndex(index);
                }
              }}
            >
              <LAText
                className=""
                size="small"
                font="400"
                color={"gray"}
                title={"❮"}
              />
              <LAView className="mx-1" />
              <LAText
                className=""
                size="small"
                font="400"
                color={"gray"}
                title={STRINGS.previous}
              />
            </LAView>
          </button>
          <div className="flex items-center gap-2 justify-center">
            <p
              onClick={() => setSelectedIndex(0)}
              className={`${
                selectedIndex === 0 ? "bg-slate-100" : "bg-slate-300"
              } border h-3 w-3 rounded-full cursor-pointer `}
            ></p>
            <p
              onClick={() => setSelectedIndex(1)}
              className={`${
                selectedIndex === 1 ? "bg-slate-100" : "bg-slate-300"
              } border h-3 w-3 rounded-full cursor-pointer `}
            ></p>
            <p
              onClick={() => setSelectedIndex(2)}
              className={`${
                selectedIndex === 2 ? "bg-slate-100" : "bg-slate-300"
              } border h-3 w-3 rounded-full cursor-pointer `}
            ></p>
            <p
              onClick={() => setSelectedIndex(3)}
              className={`${
                selectedIndex === 3 ? "bg-slate-100" : "bg-slate-300"
              } border h-3 w-3 rounded-full cursor-pointer `}
            ></p>
            <p
              onClick={() => setSelectedIndex(4)}
              className={`${
                selectedIndex === 4 ? "bg-slate-100" : "bg-slate-300"
              } h-3 w-3 rounded-full cursor-pointer `}
            ></p>
          </div>

          <button>
            <LAView
              flex="row"
              className="flex items-center"
              onClick={() => {
                if (Tutorials.length - 1 == selectedIndex) {
                  setSelectedIndex(0);
                } else {
                  const index = selectedIndex + 1;
                  setSelectedIndex(index);
                }
              }}
            >
              <LAText
                className=""
                size="small"
                font="400"
                color={"gray"}
                title={STRINGS.next}
              />
              <LAView className="mx-1" />
              <LAText
                className=""
                size="small"
                font="400"
                color={"gray"}
                title={"❯"}
              />
            </LAView>
          </button>
        </LAView>
        <LAView className="w-full">
          <LAButton
            title={"Sign In with E-mail"}
            onPress={() => {
              trackOnboardingSingup('Email')
              navigation("/login");
            }}
          />
          <LAView className="my-2 lg:my-4" />
          <LAButton
            btnType="button"
            onPress={() => signInWithGoogleHandler()}
            type={"social"}
            left={IMAGES.ic_google}
            title={STRINGS.google}
          />
          <LAView className="my-2 lg:my-4" />
          {/* {os === "iOS" || os === "iPad" || (os === "Mac OS" && ( */}
              <LAButton
                btnType="button"
                onPress={() => signInWithAppleHandler()}
                type={"social"}
                left={IMAGES.ic_apple}
                title={STRINGS.apple}
              />
            {/* ))} */}
        </LAView>
        <button onClick={() => setInfoMessage(true)}>
          <LAText
            className="mt-6 text-center"
            size="small"
            font="400"
            color={"gray"}
            title={STRINGS.why_do_i_need_signin}
          />
        </button>
      </LAView>
      {isInfoMessage && (
        <LAInfoModal
          title={STRING.why_do_i_need_signin}
          message={STRING.why_do_i_need_signin_desc}
          onCancel={() => setInfoMessage(false)}
        />
      )}
    </LAView>
  );
}

export default Leading;
