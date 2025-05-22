import { startTransition, useEffect, useState } from "react";

//PACKAGES
import { useLocation, useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";

//CONSTANTS
import { STRINGS } from "../constant";

//COMPONENTS
import {
  Header,
  SpeedoMeter,
  PremiumView,
  LAView,
  LAText,
} from "../components";
import AssesmentTest from "../components/popup/AssesmentTest";
import ChangeFont from "../components/popup/ChangeFont";
import { useContext } from "react";
import { AppContext } from "../context/AppProvider";
import { AuthContext } from "../context/AuthProvider";
import { USER_DEAFULT_KEY } from "../constant/event";
import moment from "moment";
import { BundleContext } from "../context/BundleProvider";
import ReviewPopup from "../components/ReviewPopup";
import {
  APP_BUNDLES,
  APP_DATA,
  GET_APP_NAME,
  IS_BUNDLE_APP,
} from "../../app_constant";
import { IMAGES } from "../assets";

import { ThemeContext } from "../context/ThemeProvider";
import { GET_PRACTICE_TEST } from "../../app_constant";
import { auth, firestore } from "../api/config";
import { MixpanelContext } from "../context/MixpanelProvider";
import { GET_FLASHCARDS, GET_ACRONYMS, GET_GLOSSARY } from "../api/content";
import UpdateNotification from "../components/UpdateNotification";

function Home() {
  const { bundleData, profile, isSubscribe, getSubscriptionDetails } =
    useContext(AuthContext);
  const { history, questionsList, questionScrore } = useContext(AppContext);
  const { state } = useLocation();
  const navigation = useNavigate();
  const { theme, currentTheme, getThemeName } = useContext(ThemeContext);
  const { trackHome } = useContext(MixpanelContext);
  

  const isAssesment = state?.isAssesment ?? false;
  const isShowReview = state?.isShowReview ?? false;
  const loginUser = auth()?.currentUser?.uid;
  useEffect(() => {
    const loginUser = auth().currentUser;
    if (loginUser && profile?.auth_email === "") {
    }
  }, []);

  const [isVisibleQuickAssessment, setVisibleAssessment] =
    useState(isAssesment);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [isReview, setReview] = useState(false);
  const [isNewVersionAvailable, setNewVersionAvailable] = useState(false);
  const [isCISSPDataUpdate, setIsCISSPDataUpdate] = useState(false);
  const [score, setScore] = useState(null);
  const [isGlossary, setIsGlossary] = useState([]);
  const [isAcronyms, setIsAcronyms] = useState([]);
  const [isFlashcards, setIsFlashcards] = useState([]);
  const { selectedCertificate } = useContext(BundleContext);
  const [homeState, setHomeState] = useState({
    isReset: false,
    assesmentTest: false,
    changeFont: false,
  });

  useEffect(() => {
    setScore(profile?.readiness_scores);
  }, [profile?.readiness_scores]);

  useEffect(() => {
    const checkUserProfile = async () => {
      setIsCISSPDataUpdate(false);

      if (!profile?.isQuestionLatestVersionUpdated && selectedCertificate === "cissp") {
        setIsCISSPDataUpdate(true);
      }
    };

    checkUserProfile();
  }, [profile]);


  useEffect(() => {
    trackHome();
    checkForSubscription();
  }, [profile, bundleData]);

  useEffect(() => {
    //console.log("selectedCertificate", selectedCertificate)
    const GLOSSARY = GET_GLOSSARY(selectedCertificate);
    const ACRONYMS = GET_ACRONYMS(selectedCertificate);
    const FLASHCARDS = GET_FLASHCARDS(selectedCertificate);
    setIsGlossary(GLOSSARY?.length ? true : false)
    setIsAcronyms(ACRONYMS?.length ? true : false)
    setIsFlashcards(FLASHCARDS?.length ? true : false)
    const isAssesment =
      questionScrore?.all_questions_scrores?.length == 0 ? true : false;
    if (isAssesment) {
      setHomeState((prev) => ({
        ...prev,
        assesmentTest: true,
      }));
    }
  }, []);

  useEffect(() => {
    const PRACTICE_TEST = GET_PRACTICE_TEST(selectedCertificate);
    if (PRACTICE_TEST?.length > 0) {
      const filterQuestions = questionsList?.filter(
        (item) =>
          item.practice_test_id == PRACTICE_TEST[0]?.practice_test_id ?? ""
      );
      setTotalQuestionCount(filterQuestions?.length);
    }
  }, []);
  useEffect(() => {
    if (isShowReview) {
      canUserReview();
    }
  }, []);

  async function canUserReview() {
    const result = localStorage.getItem(USER_DEAFULT_KEY?.IS_TEST_REVIEW_DONE);
    const date = localStorage.getItem(
      USER_DEAFULT_KEY?.IS_TEST_REVIEW_NEXT_DATE
    );
    const dateM = moment(date, "YYYYMMDD");
    if (!result) {
      if (dateM.isBefore() || isNaN(dateM)) {
        const new_app_test = (profile?.practice_test_history ?? [])?.filter(
          (e) => e?.is_new_app_test ?? false
        );
        const readiness_score = profile?.readiness_scores?.readiness_score ?? 0;
        if ((new_app_test ?? [])?.length >= 3 && readiness_score > 15) {
          setTimeout(() => {
            // trackReviewFromHome(); mixpanel function
            setReview(true);
          }, 1000);
        }
      }
    }
  }

  async function checkForSubscription() {
    if (IS_BUNDLE_APP) {
      getSubscriptionDetails(bundleData);
    } else {
      getSubscriptionDetails(profile);
    }
  }

  const onAcronymns = () => {
    startTransition(() => {
      navigation("/acronymns");
    });
  };

  if (isCISSPDataUpdate) {
     return (
      <UpdateNotification />
    ); 
    console.log("CISSP Data Update");
  }

  return (
    <>
      {/* <LAView type="full-element"> */}
      {/* <Header
          onChange={() => {
            setHomeState((prev) => ({ ...prev, isReset: true }));
          }}
          onProfile={() => {
            navigation("/profile");
          }}
        /> */}
      <LAView className="grid grid-cols-12 gap-[24px] px-[24px]">
        <LAView
          type="center"
          flex="col"
          styles={{ background: `${theme?.THEME_DARK}` }}
          className={`col-span-12  ${isSubscribe ? "" : "md:col-span-6"}  
                h-auto 
                sm:h-auto 
                p-[12px]
                md:p-auto
                md:h-[30vh] 
                lg:h-[35vh] 
                rounded-[20px]  bg-${theme?.THEME_DARK}`}
        >
          <LAView type="full-element-center" flex="row">
            <SpeedoMeter data={score} />
          </LAView>
        </LAView>
        {!isSubscribe && (
          <LAView
            className={`col-span-12 md:col-span-6 h-auto sm:h-auto md:h-[30vh] lg:h-[35vh] bg-[${theme?.THEME_PREMIUM_BACKGROUND}]  rounded-[20px]`}
            styles={{ background: `${theme?.THEME_PREMIUM_BACKGROUND}` }}
          >
            <PremiumView theme={theme} />
          </LAView>
        )}
      </LAView>
      <LAView className="mt-6" />
      <LAView className="grid grid-cols-12 gap-[24px] px-[24px] ">
        <LAView className={`${
      isFlashcards ? 'col-span-6 md:col-span-3' : 'col-span-12 md:col-span-4'
    } rounded-[20px] h-auto sm:h-auto md:h-[30vh] lg:h-[35vh] overflow-hidden`}>
          <div
            className={`h-full bg-[${theme?.THEME_STUDY_QUESTION_BACKGROUND}]`}
            onClick={() => navigation("/studyQuestion")}
            style={{
              background: `${theme?.THEME_STUDY_QUESTION_BACKGROUND}`,
            }}
          >
            <MenuItem
              image={IMAGES.ic_home_quiz}
              iconBg={theme.THEME_STUDY_ICON_BACKGROUND_COLOR}
              color={theme.THEME_STUDY_QUESTION_BACKGROUND}
              text={STRINGS.study_questions}
            />
          </div>
        </LAView>
        <LAView className={`${
      isFlashcards ? 'col-span-6 md:col-span-3' : 'col-span-12 md:col-span-4'
    } rounded-[20px] h-auto sm:h-auto md:h-[30vh] lg:h-[35vh] overflow-hidden`}>
          <div
            className={`h-full bg-[${theme?.THEME_PRACTICE_TEST_BACKGROUND}]`}
            onClick={() => navigation("/practicetest")}
            style={{
              background: `${theme?.THEME_PRACTICE_TEST_BACKGROUND}`,
            }}
          >
            <MenuItem
              color={theme.THEME_PRACTICE_TEST_BACKGROUND}
              iconBg={theme.THEME_PRACTICE_TEST_ICON_BACKGROUND_COLOR}
              image={IMAGES.ic_home_practice}
              text={STRINGS.practice_tests}
            />
          </div>
        </LAView>
        { isFlashcards ?
          <LAView className="col-span-6 md:col-span-3 rounded-[20px] h-auto sm:h-auto md:h-[30vh] lg:h-[35vh] overflow-hidden">
            <div
              className={`h-full bg-[${theme?.THEME_FLASHCARD_BACKGROUND}]`}
              onClick={() => navigation("/flashcard")}
              style={{
                background: `${theme?.THEME_FLASHCARD_BACKGROUND}`,
              }}
            >
              <MenuItem
                color={theme.THEME_FLASHCARD_BACKGROUND}
                iconBg={theme.THEME_FLASHCARD_ICON_BACKGROUND_COLOR}
                image={IMAGES.ic_home_flash}
                text={STRINGS.flashcards}
              />
            </div>
          </LAView> : null
        }
        <LAView className={`${
      isFlashcards ? 'col-span-6 md:col-span-3' : 'col-span-12 md:col-span-4'
    } rounded-[20px] h-auto sm:h-auto md:h-[30vh] lg:h-[35vh] overflow-hidden`}>
          <div
            className={`h-full bg-[${toString(
              theme?.THEME_CUSTOM_TEST_BACKGROUND
            )}]`}
            onClick={() => navigation("/customtest")}
            style={{
              background: `${theme?.THEME_CUSTOM_TEST_BACKGROUND}`,
            }}
          >
            <MenuItem
              color={theme.THEME_CUSTOM_TEST_BACKGROUND}
              iconBg={theme.THEME_CUSTOM_ICON_BACKGROUND_COLOR}
              image={IMAGES.ic_home_custom}
              text={STRINGS.create_custom_test}
            />
          </div>
        </LAView>
      </LAView>
      <LAView className="mt-6" />
      <LAView className="grid grid-cols-12 gap-[24px] px-[24px] ">
        {
          isGlossary ?
          <LAView
            onClick={() => navigation("/glossary")}
            type="center"
            className={`${isAcronyms ?  'col-span-6' : 'col-span-12'} border-2  rounded-lg full-element-center  py-[20px]`}
            styles={{
              color: `${
                currentTheme !== "light"
                  ? theme?.NORMAL_COLOR_WHITE
                  : theme?.THEME_DARK
              }`,
              border: `2px solid ${
                currentTheme !== "light"
                  ? theme?.NORMAL_COLOR_WHITE
                  : theme?.THEME_DARK
              }`,
              fontWeight: "500",
            }}
          >
            <button>
              <LAText
                className={`${theme?.THEME_LIGHT}`}
                size="small"
                font="400"
                color={""}
                title={STRINGS.glossary}
              />
            </button>
          </LAView> : null
        }
        {
          isAcronyms ? 
          <LAView
            onClick={() => onAcronymns()}
            type="center"
            className={`${isGlossary ?  'col-span-6' : 'col-span-12'} border-2  rounded-lg full-element-center  py-[20px]`}
            styles={{
              color: `${
                currentTheme !== "light"
                  ? theme?.NORMAL_COLOR_WHITE
                  : theme?.THEME_DARK
              }`,
              border: `2px solid ${
                currentTheme !== "light"
                  ? theme?.NORMAL_COLOR_WHITE
                  : theme?.THEME_DARK
              }`,
              fontWeight: "500",
            }}
          >
            <button>
              <LAText
                // className={`${theme?.THEME_LIGHT}`}
                size="small"
                font="400"
                color={""}
                title={STRINGS.acronymns}
              />
            </button>
          </LAView> : null
        }
      </LAView>
      {/* </LAView> */}
      {homeState?.assesmentTest && (
        <AssesmentTest
          onCancle={() => {
            setHomeState((prev) => ({ ...prev, assesmentTest: false }));
          }}
          onPress={(e, index) => {
            setHomeState((prev) => ({
              ...prev,
              assesmentTest: false,
            }));
          }}
          title="Assessment Test"
          desc="This assesment test will help us to prepare your
              baseline readiness score."
        />
      )}

      {isReview && (
        <ReviewPopup
          onCancel={() => setReview(false)}
          onReview={() => {
            // trackLoveIt();
            localStorage.setItem(USER_DEAFULT_KEY.IS_TEST_REVIEW_DONE, "true");
            setReview(false);
            // onReview();
            // if (Platform.OS == 'ios') {
            //     const locales = RNLocalize.getLocales()
            //     let code = ''
            //     if (locales?.length > 0) {
            //         code = locales[0].countryCode
            //     }
            //     else {
            //         code = 'us'
            //     }

            //     const reviewLink = `itms-apps:itunes.apple.com/${code}/app/apple-store/id${APP_DATA?.APP_ID ?? ''}?mt=8&action=write-review`
            //     Linking.openURL(reviewLink)
            // }
            // else {
            //     onReview()
            // }
          }}
          onNeedWorks={async () => {
            // trackNeedWork()
            setReview(false);
            localStorage.setItem(USER_DEAFULT_KEY.IS_TEST_REVIEW_DONE, "true");
            // const link = await getMailLink();
            // Linking.openURL(link);
          }}
          onNotYet={() => {
            // trackNotReviewYet()
            setReview(false);
            localStorage.setItem(
              USER_DEAFULT_KEY.IS_TEST_REVIEW_NEXT_DATE,
              moment().add(6, "days").format("YYYYMMDD")
            );
          }}
        />
      )}
    </>
  );
}

function MenuItem(props) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full py-[20px] px-[10px] text-center cursor-pointer"
      style={{ backgroundColor: props?.color }} // Apply background color as inline style
    >
      <div
        className="flex items-center justify-center rounded-full h-[50px] w-[50px] sm:h-[60px] sm:w-[60px] md:h-[80px] md:w-[80px] lg:h-[100px] lg:w-[100px] mb-4"
        style = {{ backgroundColor: props?.iconBg }} // Apply background color as inline style
      >
        <img
          className="h-[30px] sm:h-[40px] md:h-[50px] lg:h-[60px]"
          src={props.image}
          alt="Menu Icon"
          
        />
      </div>
      <span
        className="text-xl font-normal color-black dark:text-white" // Apply text color as inline style
      >
        {props.text}
      </span>
    </div>
  );
}


export default Home;
