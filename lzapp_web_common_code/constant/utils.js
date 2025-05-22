import { toast } from "react-toastify";

//CONSTANT
import { STRING } from ".";

export function SHOW_TOAST(message, type, visibilityTime) {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: visibilityTime || 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "info":
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    case "warning":
      toast.warn(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;

    default:
      toast(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      break;
  }
}

export function detectOS() {
  // Check if the browser supports navigator.userAgentData (modern approach)
  if (navigator.userAgentData) {
    const platforms = navigator.userAgentData.platform || navigator.userAgentData.mobile;
    if (platforms.indexOf("Windows") !== -1) return "Windows";
    if (platforms.indexOf("macOS") !== -1) return "Mac OS";
    if (platforms.indexOf("Linux") !== -1) return "Linux";
    if (platforms.indexOf("iOS") !== -1) return "iOS";
    if (platforms.indexOf("Android") !== -1) return "Android";
    if (platforms.indexOf("iPad") !== -1) return "iPad";
    return "Unknown";
  }

  // Fallback for older browsers using navigator.userAgent
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows/i.test(userAgent)) return "Windows";
  if (/macintosh|mac os x/i.test(userAgent)) return "Mac OS";
  if (/linux/i.test(userAgent)) return "Linux";
  if (/iphone/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/ipad/i.test(userAgent)) return "iPad";

  return "Unknown";
}

export function hexToRgba(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const QUESTION_PRIORITY = [
  { title: "Questions I answered incorrectly", key: STRING.incorrect_tag },
  { title: "Questions I have not yet answered", key: STRING.unanswered },
  { title: "Questions I bookmarked", key: STRING.bookmark },
  { title: "Default (App's Smart Logic)", key: STRING.default },
];

export const MIXPANEL_EVENTS = {
  OPEN_APP: "OPEN_APP",
  ONBOARDING_SCREEN_VIEW: "Onboarding Screen View",
  ONBOARDING_SIGNUP_CLICK: "Onboarding Signup Click",
  LOGIN: "Login",
  SIGNUP: "Signup",
  FORGOT_PASSWORD: "Forgot Password",
  ASSESSMENT_TYPE: "Onboarding Assessment",
  VIEW_HOME: "View Home",
  VIEW_DASHBOARD: "View Dashboard",
  VIEW_HISTORY: "View History",
  VIEW_BOOKMARK: "View Bookmarks",
  VIEW_ACRONYMS: "Clicked Acronyms",
  VIEW_GLOSSARY: "Clicked Glossary",
  SUBSCRIPTION: "Subscription",
  STUDY_QUESTIONS: "View Study Questions Screen",
  FLASH_CARD: "View Flashcards Screen",
  CUSTOM_TEST: "Custom Test Screen",
  PRACTICE_TEST_ABANDONED: "Practice Test Abandoned",
  PRACTICE_TEST_COMPLETED: "Practice Test Completed",
  PRACTICE_TEST_REVIEW: "Practice Test Review",
  ACCOUNT_SETTING: "Clicked Account Setting",
  APP_APPEARANCE: "Clicked App Appearance",
  RESET_APP_DATA: "Clicked Reset App",
  SHARE_APP: "Clicked Share App",
  OPEN_REVIEW_FROM_HOME: "Open Review From Home",
  REVIEW_APP: "Clicked Review App",
  NEED_WORK_REVIEW: "Clicked Need work on review",
  LOVE_IT_REVIEW: "Clicked Love it on review",
  NOT_REVIEW_YET: "Clicked Not Review Yet",
  OTHERS_APP: "Clicked Others App",
  HELP_SUPPORT: "Clicked Help and Support",
};

export const DEFAULT_CURRENCY = {
  country: "US",
  countryCode: "usd",
  symbol: "$",
  name: "United States dollar",
};

export const getDateFromMilliseconds = (milliseconds) => {
  // Ensure that input is a number
  if (typeof milliseconds !== "number") {
    throw new Error("Input must be a number representing milliseconds.");
  }

  // Create a new Date object using the milliseconds
  const date = new Date(milliseconds);

  // Extract the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const monthNumber = date.getMonth(); // January is 0!
  const year = date.getFullYear();

  // Array of month abbreviations
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[monthNumber];

  // Format the date string
  const dateString = `${month} ${day}, ${year}`;

  return dateString;
};

export const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
  const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
  const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const CLOULD_FUNCTION_URL =
  "https://us-central1-lsat-b6833.cloudfunctions.net/convertQuestionScores?docPath=/apps/APP_NAME/users/USER_ID";
export const SEND_MAIL_FUNCTION =
  "https://www.learnzapp.com/php/sendRedemptionEmail.php?access_code=ACCESS_CODE&expiration_date=EX_DATE&user_email=USER_EMAIL&user_name=USER_NAME&app_name=APP_NAME&is_subscription=IS_SUBSCRIPTION&redeemed_by=REDEEMED_BY";
