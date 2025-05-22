//ASSETS
import { IMAGES } from "../assets";

//COPONENTS
import { LATextInput, LAButton, LAView, LAText } from "../components";

//PACKAGES
import { useNavigate } from "react-router-dom";

//CONSTANT
import { STRINGS } from "../constant";
import {
  SIGN_IN_GOOGLE,
  SIGN_UP_APPLE,
  SIGN_UP_FIREBASE,
} from "../api/firebase_auth";
import { SHOW_TOAST, detectOS } from "../constant/utils";
import { useContext, useEffect, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { MixpanelContext } from "../context/MixpanelProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { emailRegex } from "../constant/utils";

function Signup() {
  const navigation = useNavigate();
  const [signUpState, setSignUpState] = useState({ isLoading: false });
  const [os, setOs] = useState("");
  const { trackSignup } = useContext(MixpanelContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const signInWithGoogleHandler = async () => {
    setSignUpState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_IN_GOOGLE();

    setSignUpState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "google");
      navigation("/home");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  const signInWithAppleHandler = async () => {
    setSignUpState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_UP_APPLE();

    setSignUpState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "apple");
      navigation("/home");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  const handleSubmit = async (value, { resetForm }) => {
    setSignUpState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_UP_FIREBASE(value?.email, value?.password);
    setSignUpState((prev) => ({ ...prev, isLoading: false }));

    if (result.status) {
      const name = value?.firstName + " " + value?.lastName;
      trackSignup("email", name);
      moveToPrepare(value?.firstName, value?.lastName);
    } else {
      SHOW_TOAST(result.error, "error");
    }

    resetForm();
    // navigation("/choosePlan");
  };

  async function moveToPrepare(firstName, lastName) {
    navigation("/prepare", {
      state: {
        params: {
          firstName: firstName,
          lastName: lastName,
          isFromOnboarding: true,
          isFromLoginSignup: true,
          type: "email",
        },
      },
    });
  }

  //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, "Enter atleast 2 characters")
      .required("Please enter the first name")
      .matches(/^(\S+$)/g, "This field cannot contain only blankspaces")
      .matches(/^[a-zA-Z]+$/, "Only alphabetic characters allowed"),
    last_name: Yup.string()
      .min(2, "Enter atleast 2 characters")
      .required("Please enter the last name")
      .matches(/^(\S+$)/g, "This field cannot contain only blankspaces")
      .matches(/^[a-zA-Z]+$/, "Only alphabetic characters allowed"),
    email: Yup.string().required("Please enter the field"),
    email: Yup.string()
      .matches(emailRegex, "Invalid email address")
      .required("Please enter the email"),
    password: Yup.string()
      .required("Please enter the password")
      .min(6, "Password must contain at least 6 characters")
      .matches(/^\S*$/, "Password should not contain any whitespace")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/\d/, "Password must contain at least one digit")
      .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
    
    // .matches(
    //   "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
    //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    // ),
  });

  useEffect(() => {
    const detectedOs = detectOS();
    setOs(detectedOs);
  }, []);
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
    <>
      <div className="min-h-screen flex items-center justify-center bg-lz-blue dark:bg-gray-800">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <img src={IMAGES.logo_prepare} alt="LearnZapp" className="w-1/2 mx-auto" />
            <h1 className="text-2xl mt-4 dark:text-white">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign up to start your learning journey</p>
          </div>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            email: "",
            password: "",
          }}
          enableReinitialize
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
            setFieldValue,
          }) => {
            return (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
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
                <div>
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
                <div>
                    <div className="relative w-full">
                      <img src={IMAGES.ic_email} alt="Email Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        id="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.email}
                        placeholder="Email address"
                        className="w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-xs text-rose-500 mt-1"
                    />
                  </div>
                  <div>
                    <div className="relative w-full">
                      <img src={IMAGES.ic_lock} alt="Password Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values?.password}
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 focus:outline-none"
                      >
                        <img src={showPassword ? IMAGES.ic_hide : IMAGES.ic_view} alt="Toggle Password Visibility" className="w-5 h-5" />

                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs text-rose-500 mt-1"
                    />
                  </div>
                  <div className="space-y-4 mt-6">

                    <button
                      type="submit"
                      className="w-full text-white py-4 rounded-lg bg-lz-blue hover:bg-lz-orange transition dark:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-900"
                    >
                      {STRINGS.singup}
                    </button>


                    <button
                      type="button"
                      onClick={signInWithGoogleHandler}
                      className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-4 rounded-lg hover:bg-gray-100 transition dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      <img src={IMAGES.ic_google} alt="Google Icon" className="w-6 h-6 mr-2" />
                      {STRINGS.google}
                    </button>


                    {/* {(os === "iOS" || os === "iPad" || os === "Mac OS") && ( */}

                      <button
                        type="button"
                        onClick={signInWithAppleHandler}
                        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-4 rounded-lg hover:bg-gray-100 transition dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <img src={IMAGES.ic_apple} alt="Apple Icon" className="w-6 h-6 mr-2" />
                        {STRINGS.apple}
                      </button>
                    {/* )} */}
                  </div>
                  </form>
            );
          }}
          </Formik>
          <p
                      className="justify-center pt-10 text-center text-gray-600 dark:text-gray-400"
                    >
                      {STRINGS.already_have_account}  <span className="text-blue-500 cursor-pointer hover:underline dark:text-blue-400"  onClick={() => navigation("/login")}> Login </span>
                    </p>
                  
                    </div>
      </div>
    </>
  );
}

export default Signup;
