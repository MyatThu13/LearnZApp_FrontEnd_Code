// import { IMAGES } from "../lzapps_common_code/assets";

// import { USER_DEAFULT_KEY } from "../lzapps_common_code/constant";

// import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  APP_DOMAIN_LIST as APP_DOMAIN_LIST_SSCP,
  PRACTICE_TEST as PRACTICE_TEST_SSCP,
  GET_STUDY_QUESTION_MENU as GET_STUDY_QUESTION_MENU_SSCP,
  GET_FLASH_CARD_MENU as GET_FLASH_CARD_MENU_SSCP,
  QUESTION_VERSION_OF_JSON as QUESTION_VERSION_OF_JSON_SSCP,
} from "./sscp";
import {
  APP_DOMAIN_LIST as APP_DOMAIN_LIST_CCSP,
  PRACTICE_TEST as PRACTICE_TEST_CCSP,
  GET_STUDY_QUESTION_MENU as GET_STUDY_QUESTION_MENU_CCSP,
  GET_FLASH_CARD_MENU as GET_FLASH_CARD_MENU_CCSP,
  QUESTION_VERSION_OF_JSON as QUESTION_VERSION_OF_JSON_CCSP,
} from "./ccsp";
import {
  APP_DOMAIN_LIST as APP_DOMAIN_LIST_CISSP,
  PRACTICE_TEST as PRACTICE_TEST_CISSP,
  GET_STUDY_QUESTION_MENU as GET_STUDY_QUESTION_MENU_CISSP,
  GET_FLASH_CARD_MENU as GET_FLASH_CARD_MENU_CISSP,
  QUESTION_VERSION_OF_JSON as QUESTION_VERSION_OF_JSON_CISSP,
} from "./cissp";

import LOGO_SSCP from "./sscp/logo_app_title.png";
import LOGO_CCSP from "./ccsp/logo_app_title.png";
import LOGO_CISSP from "./cissp/logo_app_title.png";

import LOGO_LANDSCAPE_SSCP from "./sscp/logo_landscape.png";
import LOGO_LANDSCAPE_CCSP from "./ccsp/logo_landscape.png";
import LOGO_LANDSCAPE_CISSP from "./cissp/logo_landscape.png";
import { IMAGES } from "../lzapp_web_common_code/assets";
import { USER_DEAFULT_KEY } from "../lzapp_web_common_code/constant/event";

export const APP_BUNDLES = [
  {
    title: "CISSP",
    key: "cissp",
    bundle_firebase_collection_name: "CISSP",
    bundle_id: 1,
    THEME_DARK: "#0973ba",
    THEME_LIGHT: "#f79764",
    THEME_BORDER: "#0868a7",
    PREMIUM_BACKGROUND: "#e6f1f8",
    THEME_DARK_MODE: "#1E1F25",
    THEME_LIGHT_DARK_MODE: "#f79764",
    THEME_BORDER_DARK_MODE: "#18191e",
    PREMIUM_BACKGROUND_DARK_MODE: "#1E1F25"
  },
  {
    title: "CCSP",
    key: "ccsp",
    bundle_firebase_collection_name: "CCSP",
    bundle_id: 2,
    THEME_DARK: "#0973ba", // LZ_BLUE'#351d53',
    THEME_LIGHT: "#f79764", // LZ_ORANGE '#6632a6',
    THEME_BORDER: "#0868a7", //'#584171',
    PREMIUM_BACKGROUND: "#e6f1f8", //"#ebe8ee",
    THEME_DARK_MODE: "#1E1F25",
    THEME_LIGHT_DARK_MODE: "#f79764",
    THEME_BORDER_DARK_MODE: "#18191e",
    PREMIUM_BACKGROUND_DARK_MODE: "#1E1F25"
  },
  {
    title: "SSCP",
    key: "sscp",
    bundle_firebase_collection_name: "SSCP",
    bundle_id: 3,
    THEME_DARK: "#0973ba", // LZ_BLUE'#351d53',
    THEME_LIGHT: "#f79764", // LZ_ORANGE '#6632a6',
    THEME_BORDER: "#0868a7", //'#584171',
    PREMIUM_BACKGROUND: "#e6f1f8", //"#ebe8ee",
    THEME_DARK_MODE: "#1E1F25",
    THEME_LIGHT_DARK_MODE: "#f79764",
    THEME_BORDER_DARK_MODE: "#18191e",
    PREMIUM_BACKGROUND_DARK_MODE: "#1E1F25"
  },
];

export const APP_DATA = {
  SUBSCRIPTION_PLANS: [1, 3, 6, 12],
  DISPLAY_APP_NAME: "CISSP-CCSP-SSCP ISC2 Official App",
  APP_ID: "1555533017",
};

export const GET_APP_NAME = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return "SSCP";
    } else if (SELECTED_BUNDLE == "ccsp") {
      return "CCSP";
    } else if (SELECTED_BUNDLE == "cissp") {
      return "CISSP";
    }
  } else {
    return "CISSP";
  }
};

const APP_NAME = "ISC2_BUNDLE";

export const BUNDLE_APP_NAME = "ISC2_BUNDLE";

// export const PRODUCT_ID = "prod_OhRJ0hhLY1kPkY";

export const IS_BUNDLE_APP = true;

export const GET_APP_NAME_FOR_COLLECTION = async () => {
  const result = localStorage.getItem(USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS);
  if (result) {
    if (result == "sscp") {
      return "SSCP";
    } else if (result == "ccsp") {
      return "CCSP";
    } else if (result == "cissp") {
      return "CISSP";
    }
  } else {
    return "CISSP";
  }
};

export const GET_APP_NAME_FOR_LOGO = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return "<strong>SSCP</strong> ISC2 Official App";
    } else if (SELECTED_BUNDLE == "ccsp") {
      return "<strong>CCSP</strong> ISC2 Official App";
    } else if (SELECTED_BUNDLE == "cissp") {
      return "<strong>CISSP</strong> ISC2 Official App";
    }
  } else {
    return "ISC2 Official App";
  }
};

export const GET_QUESTION_VERSION_OF_JSON = async () => {
  // const result = false;
  const result = localStorage.getItem(USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS);

  if (result) {
    if (result == "sscp") {
      return QUESTION_VERSION_OF_JSON_SSCP;
    } else if (result == "ccsp") {
      return QUESTION_VERSION_OF_JSON_CCSP;
    } else if (result == "cissp") {
      return QUESTION_VERSION_OF_JSON_CISSP;
    }
  } else {
    return QUESTION_VERSION_OF_JSON_CISSP;
  }
};

export let THEME_DARK = "#592409";
export let THEME_LIGHT = "#FF610F";
export let THEME_BORDER = "#693921";
export let PREMIUM_BACKGROUND = "#FFEAE0";

export let THEME_DARK_MODE = "#177346";
export let THEME_LIGHT_DARK_MODE = "#1AA260";
export let THEME_BORDER_DARK_MODE = "#693921";
export let PREMIUM_BACKGROUND_DARK_MODE = "#FFEAE0";

/*** STATIC STRINGS ***/
const app_url = "https://www.learnzapp.com/apps/cissp";

export const GET_PRACTICE_TEST = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return PRACTICE_TEST_SSCP;
    } else if (SELECTED_BUNDLE == "ccsp") {
      return PRACTICE_TEST_CCSP;
    } else if (SELECTED_BUNDLE == "cissp") {
      return PRACTICE_TEST_CISSP;
    }
  } else {
    return PRACTICE_TEST_CISSP;
  }
};

export const GET_APP_DOMAIN_LIST = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return APP_DOMAIN_LIST_SSCP;
    } else if (SELECTED_BUNDLE == "ccsp") {
      return APP_DOMAIN_LIST_CCSP;
    } else if (SELECTED_BUNDLE == "cissp") {
      return APP_DOMAIN_LIST_CISSP;
    }
  } else {
    return APP_DOMAIN_LIST_CISSP;
  }
};

export const GET_STUDY_QUESTION_MENU = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return GET_STUDY_QUESTION_MENU_SSCP();
    } else if (SELECTED_BUNDLE == "ccsp") {
      return GET_STUDY_QUESTION_MENU_CCSP();
    } else if (SELECTED_BUNDLE == "cissp") {
      return GET_STUDY_QUESTION_MENU_CISSP();
    }
  } else {
    return GET_STUDY_QUESTION_MENU_CISSP();
  }
};

export const GET_FLASH_CARD_MENU = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return GET_FLASH_CARD_MENU_SSCP();
    } else if (SELECTED_BUNDLE == "ccsp") {
      return GET_FLASH_CARD_MENU_CCSP();
    } else if (SELECTED_BUNDLE == "cissp") {
      return GET_FLASH_CARD_MENU_CISSP();
    } else {
      return GET_FLASH_CARD_MENU_CISSP();
    }
  }
};

/** PROFILE MENU */
export const GET_PROFILE_MENU = () => {
  return [
    {
      title: "App Appearance",
      image: IMAGES?.ic_dark_mode,
    },
    {
      title: "Account Setting",
      image: IMAGES?.ic_account,
    },
    {
      title: "Settings",
      image: IMAGES?.ic_subscription,
    },
    {
      title: "Reset App Data",
      image: IMAGES?.ic_reset,
    },
    {
      title: "Share this app",
      image: IMAGES?.ic_share_app,
    },
    {
      title: "Review App",
      image: IMAGES?.ic_review,
    },
    {
      title: "Other Apps",
      image: IMAGES?.ic_other_app,
    },
    {
      title: "Help and Support",
      image: IMAGES?.ic_help,
    },
  ];
};

/*** LEADING SCREEN TUTORIAL ARRAY ***/
export const GET_TUTORIALS = () => {
  return [
    {
      title: `Official ISC2 Study App`,
      image: IMAGES.slide_1,
      description:
        "Ace your exam on the first try with this comprehensive study app! \nOver 5000 practice questions and 2000 flashcards to help you succeed in ISC2 exams CISSP, CCSP and SSCP",
    },
    {
      title: "Readiness Score",
      image: IMAGES.slide_2,
      description:
        "The readiness score in the app provides a quick and easy way for you to assess your level of preparedness for the real exam, and to identify areas where you need to focus your study efforts in order to improve their chances of success.",
    },
    {
      title: "Practice makes Perfect!!",
      image: IMAGES.slide_3,
      description:
        "Create your own custom tests by choosing the topics and the number of questions or take pre-built practice tests and mock exams. \nThe custom test engine creates personalized tests with new and your weakest questions.",
    },
    {
      title: "Track your Progress",
      image: IMAGES.slide_4,
      description:
        "Keep track of your progress through the study materials and see how much you have left to complete. \nView the history of your completed tests and re-take any of them as needed.",
    },
    {
      title: "Available on-the-go",
      image: IMAGES.slide_5,
      description:
        "The app is available on both iOS and Android devices, so you study anywhere, anytime. \nYou can seamlessly access and work with your data across multiple devices.",
    },
  ];
};

export const GET_QUICK_ASSESSMENT = () => {
  return {
    title: "Assessment Test",
    image: IMAGES.quick_assessment,
    description:
      "This assessment test will help us prepare your baseline readiness score.",
  };
};

/** PLAN DETAILS */
export const PREMIUM_PLAN_DETAILS = [
  "Unlock your exam prep potential with our all-inclusive features: Dive into CISSP, CCSP, and SSCP exam materials, tackle <strong>5000 practice questions</strong> with detailed answers, and reinforce learning with <strong>2000 flashcards</strong>. Master essential terminology with our glossary of <strong>2000 terms and acronyms</strong>. Evaluate your readiness and focus your studies with our <strong>Readiness Score</strong> and <strong>Custom Test Builder</strong>, designed to tailor your practice and ensure comprehensive preparation.",
];

/** FREE PLANS */
export const FREE_PLAN_DETAILS = [
  "Limited access to a selection of questions and flashcards. Explore the app's features with the free plan before upgrading to premium."
  /* "Limited access to Questions and Flashcards",
  "Try all the app features before buying a premium plan",
  "Know your exam readiness with Readiness Score",
  "Build your custom test or practice on prebuilt test",
  "Exam concept with Flashcards, Glossary and Acronyms", */
];

/** PLAN PRICING */
export const PLAN_PRICING = [
  {
    off_percentage: "",
    month_price: "$5",
    bill_price: "$5",
    bill_time: "Monthly",
  },
  {
    off_percentage: "10% Off",
    month_price: "$4",
    bill_price: "$24",
    bill_time: "Quarterly",
  },
  {
    off_percentage: "",
    month_price: "$3",
    bill_price: "$36",
    bill_time: "Annually",
  },
];

/** STRINGS */
export const STRING = {
  share_message:
    "Hey there, I am using this app to prepare for (ISC)2 CISSP, CCSP and SSCP certification exams. I think you will find it very useful. Check it out " +
    app_url,
};

export const GET_APP_HEADER_LOGO = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return LOGO_SSCP;
    } else if (SELECTED_BUNDLE == "ccsp") {
      return LOGO_CCSP;
    } else if (SELECTED_BUNDLE == "cissp") {
      return LOGO_CISSP;
    }
  } else {
    return LOGO_CISSP;
  }
};

export const GET_APP_LANDSACPE_HEADER_LOGO = (SELECTED_BUNDLE) => {
  if (SELECTED_BUNDLE) {
    if (SELECTED_BUNDLE == "sscp") {
      return LOGO_SSCP;
    } else if (SELECTED_BUNDLE == "ccsp") {
      return LOGO_CCSP;
    } else if (SELECTED_BUNDLE == "cissp") {
      return LOGO_CISSP;
    }
  } else {
    return LOGO_CISSP;
  }
};

export const THIRD_PARTY_CONFIG = {
  STRIPE_PRODUCT_ID: process.env.REACT_APP_STRIPE_PRODUCT_ID,
  MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN,
};

