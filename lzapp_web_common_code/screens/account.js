//PACKAGES
import { useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { STRING, STRINGS } from "../constant";
import { IMAGES } from "../assets";

//COMPONENTS
import { Header, LAView, LAText, LATextInput, LAButton } from "../components";

//API
import {
  DELETE_BUNDLE_USER,
  DELETE_USER,
  GET_STORE_AUTH_DETAILS,
  UPDATE_PROFILE_DETAILS,
} from "../api/firebase_user";

//PACKAGES
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconTint from "react-icon-tint";
import { auth } from "../api/config";
import { IS_BUNDLE_APP } from "../../app_constant";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { SHOW_TOAST } from "../constant/utils";
import BackArrowIcon from "../components/BackArrowIcon";
import { ThemeContext } from "../context/ThemeProvider";
import { ErrorMessage, Formik } from "formik";
import { MixpanelContext } from "../context/MixpanelProvider";
import * as Yup from "yup";

function Account() {
  const navigation = useNavigate();
  const { bundleData, profile, setProfileDetails, isSubscribe } =
    useContext(AuthContext);
  const { resetMixpanel } = useContext(MixpanelContext);

  const { theme, currentTheme } = useContext(ThemeContext);
  const [editble, setEditable] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [firstName, setFirstName] = useState(
    IS_BUNDLE_APP
      ? bundleData?.auth_first_name ?? ""
      : profile?.auth_first_name ?? ""
  );
  const [lastName, setLastName] = useState(
    IS_BUNDLE_APP
      ? bundleData?.auth_last_name ?? ""
      : profile?.auth_last_name ?? ""
  );
  const [email, setEmail] = useState(
    IS_BUNDLE_APP ? bundleData?.auth_email ?? "" : profile?.auth_email ?? ""
  );

  const [loginMethod, setLoginMethod] = useState(
    IS_BUNDLE_APP
      ? bundleData?.auth_login_provider ?? ""
      : profile?.auth_login_provider ?? ""
  );
  
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsModalOpen(false);
    deleteAccount();
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  function getLoginMethod() {
    if (loginMethod == "google.com") {
      return "Sign in with Google";
    } else if (loginMethod == "apple.com") {
      return "Sign in with Apple";
    } else {
      return "Sign in with Email";
    }
  }

  function isEmailLogin() {
    if (loginMethod == "google.com") {
      return false;
    } else if (loginMethod == "apple.com") {
      return false;
    } else {
      return true;
    }
  }

  async function onSave() {
    // Regular expression for validating names (only letters, no spaces, numbers, or symbols)
    const nameRegex = /^[A-Za-z]+$/;
    // Keyboard.dismiss();
    if (!firstName.trim()) {
      SHOW_TOAST(STRING.enter_first_name, "error");
    } else if (!lastName.trim()) {
      SHOW_TOAST(STRING.enter_last_name, "error");
    } else if (!nameRegex.test(firstName)) {
      SHOW_TOAST("Invalid first name", "error");
    } else if (!nameRegex.test(lastName)) {
      SHOW_TOAST("Invalid last name", "error");
    } else {
      setProfileDetails(firstName, lastName);

      // const result = await UPDATE_PROFILE_DETAILS(firstName, lastName);

      navigation(-1);
    }
  }

  async function onSignuOut() {
    setLoading(true);
    await auth().signOut();
    // localStorage.clear();
    setLoading(false);
    resetMixpanel();

    navigation("/login");
    localStorage.removeItem("appState");
  }

  async function deleteAccount() {
    setLoading(true);
    try {
    } catch (err) {
      console.error(err);
    }
    const uid = auth().currentUser?.uid;
    const provider = auth().currentUser?.providerData[0]?.providerId ?? "";
    const result = await DELETE_USER(uid);
    if (IS_BUNDLE_APP) {
      try {
        await DELETE_BUNDLE_USER(uid);
        localStorage.clear();
        navigation("/login");
      } catch (err) {
        console.error(err);
      }
    }
    try {
      const resultApps = await GET_STORE_AUTH_DETAILS();
      if (result.status == true) {
        setLoading(false);
        if (resultApps.status) {
          if (resultApps?.data?.apps?.length <= 1) {
            await auth().currentUser.delete();
          }
        }

        SHOW_TOAST("Your account has been deleted successfully", "success");
        localStorage.clear();
        navigation("/login");
      } else {
        setLoading(false);
        setTimeout(() => {
          SHOW_TOAST(result.error, "error");
        }, 1000);
      }
    } catch (e) {
      setLoading(false);
      setTimeout(() => {
        authError(e);
      }, 1000);
    }
    await onSignuOut();
  }

  function authError(error) {
    if (error.code == "auth/requires-recent-login") {
      // Alert.alert('', 'This operation is sensitive and requires recent authentication. Log in again before retrying this request. Logout and Login again to delete your account', [
      //     { text: STRING.cancel, style: 'cancel', onPress: () => { } },
      //     {
      //         text: STRING.sign_out, style: 'destructive', onPress: () => {
      //             onSignuOut()
      //         }
      //     }
      // ])
    } else {
      // Alert.alert("", error.message);
    }
  }

  const handleSubmit = (value) => {
    
    setProfileDetails(value?.first_name, value?.last_name);

    SHOW_TOAST("Profile updated successfully", "success");
    navigation(-1);
  };

  const onEditProfileInfo = () => {
    setEditable(!editble);
  };

  function getLoginMethod() {
    if (loginMethod == "google.com") {
      return "Sign in with Google";
    } else if (loginMethod == "apple.com") {
      return "Sign in with Apple";
    } else {
      return "Sign in with Email";
    }
  }

  const loginType = getLoginMethod();

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, "Enter atleast 2 characters")
      .required("Please enter the first name")
      .matches(/^(\S+$)/g, "First Name cannot contain blankspaces")
      .matches(/^[a-zA-Z]+$/, "Only alphabetic characters allowed"),
    last_name: Yup.string()
      .min(2, "Enter atleast 2 characters")
      .required("Please enter the last name")
      .matches(/^(\S+$)/g, "Last Name cannot contain blankspaces")
      .matches(/^[a-zA-Z]+$/, "Only alphabetic characters allowed"),
  });
  return (
    <>
      {/* <Header /> */}
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation(-1);
          }}
        >
          <BackArrowIcon
            color={currentTheme === "light" ? "#101010" : "#fff"}
          />
        </button>
        <LAView flex="col" className="flex-1 mx-6">
          <div className="flex items-center justify-between">
            <LAText
              className="flex line-clamp-1 truncate"
              size="medium"
              font="600"
              color={"black"}
              title={"Account Setting"}
            />

            {/* {!editble ? (
              <button
                className={
                  currentTheme === "light"
                    ? "#101010 border-2 rounded-2xl p-2"
                    : "#fff #101010 border-2 rounded-2xl p-2"
                }
                onClick={() => onEditProfileInfo()}
              >
                <svg
                  stroke="currentColor"
                  fill={currentTheme === "light" ? "#101010" : "#fff"}
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1.3em"
                  width="1.3em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                </svg>
              </button>
            ) : (
              <button
                className="border-2 border-black rounded-2xl p-2 "
                onClick={() => onSave()}
              >
                <img className="w-6 h-6 filter invert" src={IMAGES?.ic_save} />
              </button>
            )} */}
          </div>
        </LAView>
      </LAView>

      <Formik
        initialValues={{
          first_name: firstName ?? "",
          last_name: lastName ?? "",
        }}
        enableReinitialize
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({
          setFieldValue,
          handleChange,
          values,
          errors,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="w-1/2 item-center">
                <div className="ml-20 mt-10">
                  <div className="relative w-full">
                    <img src={IMAGES.ic_profile} alt="Profile Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.first_name}
                      placeholder="First Name"
                      className="w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-rose-500 text-xs"
                  />
                </div>
                <div className="ml-20 mt-10">
                  <div className="relative w-full">
                    <img src={IMAGES.ic_profile} alt="Profile Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.last_name}
                      placeholder="Last Name"
                      className="w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-rose-500 text-xs"
                  />
                </div>
                <div className="ml-20 mt-10 flex justify-center w-1/2">
                  <button
                      type="submit"
                      className="w-full justify-center text-white py-4 rounded-lg bg-lz-blue hover:bg-lz-orange transition text-gray-900 "
                  >
                      Save
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>

      <div className="ml-20 mt-10">
        <div className="relative w-full">
          <p className="text-lg font-semibold text-lz-orange">Email: </p>
          <p className="text-lg  text-gray-500 dark:text-gray-300">{email ? email : profile?.auth_email}</p>
        </div>
      </div>
      <div className="ml-20 mt-5">
        <div className="relative w-full">
          <p className="text-lg font-semibold text-lz-orange">Login Method: </p>
          <p className="text-lg text-gray-500 dark:text-gray-300">{loginType}</p>
        </div>
      </div>


      <div className="w-1/2 item-center">
        <div className="ml-20 mt-10 flex justify-center w-1/2">
            <button
                className="w-full justify-center text-white py-4 rounded-lg bg-lz-blue hover:bg-lz-orange transition  text-gray-900"
                onClick={onSignuOut}
            >
                {STRINGS.sign_out}
            </button>
        </div>
        <div className="ml-20 mt-10 flex justify-center w-1/2">
            <button
                className="w-full justify-center text-white py-4 rounded-lg bg-gray-500 hover:bg-gray-700 transition text-gray-900 dark:text-gray-900"
                onClick={handleDeleteClick}
            >
                {STRINGS.delete_account}
            </button>
        </div>
        
                
  
</div>
{isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Warning</h2>
            <p className="mb-4">This action will delete all your account and is irreversible. Are you sure you want to delete your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      

      
    </>
  );
  
}

export default Account;
