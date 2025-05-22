import { IMAGES } from "../assets";

//COPONENTS
import { LATextInput, LAButton, LAView, LAText } from "../components";

//PACKAGES
import { useNavigate } from "react-router-dom";

//CONSTANT
import { STRINGS } from "../constant";
import { ErrorMessage, Formik } from "formik";
import {
  SIGN_IN_FIREBASE,
  SIGN_UP_FIREBASE,
  SIGN_IN_GOOGLE,
  SIGN_UP_APPLE,
} from "../api/firebase_auth";
import { SHOW_TOAST, detectOS } from "../constant/utils";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { useEffect } from "react";
import { MixpanelContext } from "../context/MixpanelProvider";
import { emailRegex } from "../constant/utils";

function Login() {
  const [loginState, setLoginState] = useState({ isLoading: false });
  const [isPrepare, setIsPrepare] = useState(false);
  const [os, setOs] = useState("");
  const navigation = useNavigate();
  const { trackOnboardingSingup } = useContext(MixpanelContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (value, { setFieldValue }) => {
    trackOnboardingSingup("Signup");
    setLoginState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_IN_FIREBASE(value?.email, value?.password);
    setLoginState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(null, "email");
      // navigation("/signup");
      // navigation("/home");
    } else {
      SHOW_TOAST(result.error, "error");
      setFieldValue('password', '');
    }

    // resetForm();
    // navigation("/home");
  };

  const signInWithGoogleHandler = async () => {
    trackOnboardingSingup("Google");
    setLoginState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_IN_GOOGLE();
    setLoginState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "google");
      // navigation("/home");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  const signInWithAppleHandler = async () => {
    setLoginState((prev) => ({ ...prev, isLoading: true }));
    const result = await SIGN_UP_APPLE();
    setLoginState((prev) => ({ ...prev, isLoading: false }));
    if (result.status) {
      moveToPrepare(result.data, "apple");
    } else if (result.error) {
      SHOW_TOAST(result.error, "error", 5000);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Please enter the email")
      .matches(emailRegex, "Invalid email address"),
    //.matches(/^(?!.*@[^,]*,)/),
    password: Yup.string()
      .required("Please enter the password")
      .min(6, "Password must contain at least 6 Characters")
      .matches(/^\S*$/, "Password should not contain any whitespace"),
  });

  useEffect(() => {}, [isPrepare]);

  async function moveToPrepare(result, type) {
    setIsPrepare(true);
    let firstName = "";
    let lastName = "";
    if (result?.additionalUserInfo?.isNewUser) {
      firstName = result?.additionalUserInfo.profile?.given_name;
      lastName = result?.additionalUserInfo.profile?.family_name;
    } else if (result?.firstName && result?.firstName != "") {
      firstName = result?.firstName;
      lastName = result?.lastName;
    }
    setTimeout(() => {
      setIsPrepare(false);
    }, 3000);
    navigation("/prepare", {
      state: {
        params: {
          firstName: firstName,
          lastName: lastName,
          isFromOnboarding: false,
          isFromLoginSignup: true,
          type: type,
        },
      },
    });
  }

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
            <img
              src={IMAGES.logo_prepare}
              alt="LearnZapp"
              className="w-1/2 mx-auto"
            />
            <h1 className="text-2xl mt-4 dark:text-white">Welcome Back!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to Continue your learning journey
            </p>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            enableReinitialize
            onSubmit={handleLogin}
            validationSchema={validationSchema}
          >
            {({
              values,
              errors,
              handleSubmit,
              handleBlur,
              handleChange,
              setFieldValue,
            }) => {
              return (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <div className="relative w-full">
                      <img
                        src={IMAGES.ic_email}
                        alt="Email Icon"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      />
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
                      <img
                        src={IMAGES.ic_lock}
                        alt="Password Icon"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      />
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
                        <img
                          src={showPassword ? IMAGES.ic_hide : IMAGES.ic_view}
                          alt="Toggle Password Visibility"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-xs text-rose-500 mt-1"
                    />
                  </div>
                  <p
                    onClick={() => navigation("/forgot_password")}
                    className="mt-2 text-right text-sm text-blue-500 cursor-pointer hover:underline dark:text-blue-400"
                  >
                    {STRINGS.forgot_password}
                  </p>
                  <div className="space-y-4 mt-6">
                    <button
                      type="submit"
                      className="w-full text-white py-4 rounded-lg bg-lz-blue hover:bg-lz-orange transition dark:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-900"
                    >
                      {STRINGS.signin_register}
                    </button>

                    <button
                      type="button"
                      onClick={signInWithGoogleHandler}
                      className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-4 rounded-lg hover:bg-gray-100 transition dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                    >
                      <img
                        src={IMAGES.ic_google}
                        alt="Google Icon"
                        className="w-6 h-6 mr-2"
                      />
                      {STRINGS.google}
                    </button>

                    {/* {(os === "iOS" || os === "iPad" || os === "Mac OS") && ( */}
                      <button
                        type="button"
                        onClick={signInWithAppleHandler}
                        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-600 py-4 rounded-lg hover:bg-gray-100 transition dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <img
                          src={IMAGES.ic_apple}
                          alt="Apple Icon"
                          className="w-6 h-6 mr-2"
                        />
                        {STRINGS.apple}
                      </button>
                    {/* )} */}
                  </div>
                </form>
              );
            }}
          </Formik>
          {/* <div className="text-center my-2 text-gray-600 dark:text-gray-400">
            {STRINGS.or}
          </div> */}
          <p className="justify-center pt-10 text-center text-gray-600 dark:text-gray-400">
            {STRINGS.dont_have_an_account}{" "}
            <span
              className="text-blue-500 cursor-pointer hover:underline dark:text-blue-400"
              onClick={() => navigation("/signup")}
            >
              {" "}
              {STRINGS.singup}{" "}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
