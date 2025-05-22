import { useContext, useEffect } from "react";

//CONSTANTS
import { STRINGS } from "../constant";

//COMPONENTS
import { LAView, LAText } from "../components";

//PACKAGES
import { useLocation, useNavigate } from "react-router-dom";
import { Rings } from "react-loader-spinner";
import { auth } from "../api/config";
import { GET_APP_NAME, GET_QUESTION_VERSION_OF_JSON } from "../../app_constant";
import {
  GET_USER_PROFILE,
  STORE_AUTH_DETAILS,
  UPDATE_USER_AUTH_DETAILS,
} from "../api/firebase_user";
import {
  GET_APP_CONFIG,
  GET_COMMUNITY_DATA,
  GET_QUESTIONS,
} from "../api/community";
import { GET_SCORE_QUESTIONS } from "../api/questions";
import { USER_DEAFULT_KEY } from "../constant/event";
import { GET_LOCAL_QUESTIONS } from "../api/content";
import { SHOW_TOAST } from "../constant/utils";
import { AuthContext } from "../context/AuthProvider";
import { MixpanelContext } from "../context/MixpanelProvider";
import { ThemeContext } from "../context/ThemeProvider";

function Prepare() {
  const { state } = useLocation();
  const firstName = state?.params?.firstName ?? "";
  const lastName = state?.params?.lastName ?? "";
  const isFromOnboarding = state?.params?.isFromOnboarding ?? false;
  const isFromLoginSignup = state?.params?.isFromLoginSignup ?? false;
  const loginSignupType = state?.params?.type ?? "";

  const {
    setProfile,
    setNewProfile,
    setCommunityData,
    setQuestionsList,
    getSubscriptionDetails,
    setVisibleCommunity,
    setAllQuestionData,
    questionScrore,
  } = useContext(AuthContext);
  const { trackOpenApp, trackLogin, trackSignup } = useContext(MixpanelContext);
  const { theme } = useContext(ThemeContext);
  const navigation = useNavigate();
  useEffect(() => {}, [state]);

  //   useEffect(() => {
  //     setTimeout(() => {
  //       navigation("/home");
  //     }, 3000);
  //   }, []);

  useEffect(() => {
    initFirebase();
  }, []);

  async function initFirebase() {
    if (isFromOnboarding == false) {
      trackOpenApp();
    }

    if (auth()?.currentUser && auth()?.currentUser?.uid) {
      //   await setupPurchase();
      await storeAuthData();
      await getAppConfig();
      const res = await getScoreQuestions();
      await getCommunities();
      await getProfileDetails(res?.data, res?.exist);
    } else {
      moveToLogin();
    }
  }

  async function moveToLogin() {
    // navigation("/home");
  }

  async function storeAuthData() {
    const APP_NAME = GET_APP_NAME();
    STORE_AUTH_DETAILS(APP_NAME);
  }

  async function getAppConfig() {
    const result = await GET_APP_CONFIG();
    if (result.status && result.data) {
      const isVisible = result?.data?.visible_community ?? false;
      setVisibleCommunity(isVisible);
    } else {
      // console.log("community visible", false);
      setVisibleCommunity(false);
    }
  }

  async function getScoreQuestions() {
    const result = await GET_SCORE_QUESTIONS();
    setAllQuestionData(result?.data ?? []);
    return { data: result?.data ?? [], exist: result.isExist };
  }

  async function getCommunities() {
    const result_community = await GET_COMMUNITY_DATA();
    /* console.debug(`
    GET_COMMUNITY_DATA --> 
    \n#Details ${JSON.stringify(result_community)}
    `) */

    if (result_community.status) {
      let data = {
        total_time_per_question:
          result_community?.data?.total_time_per_question ?? 60,
        questions_version: result_community?.data?.questions_version ?? 1,
        android_app_verions:
          result_community?.data?.android_app_verions ?? null,
        android_build_number:
          result_community?.data?.android_build_number ?? null,
        ios_app_version: result_community?.data?.ios_app_version ?? null,
        ios_build_number: result_community?.data?.ios_build_number ?? null,
        is_forcefully_new_version:
          result_community?.data?.is_forcefully_new_version ?? false,
      };
      // setCommunityData(data);

      let jsonVersion = await GET_QUESTION_VERSION_OF_JSON();
      let savedVersion = localStorage.getItem(
        USER_DEAFULT_KEY.QUESTION_VERSION
      );

      if (jsonVersion >= data.questions_version) {
        const questions = GET_LOCAL_QUESTIONS();
        // setQuestionsList(questions);
      } else if (savedVersion && savedVersion == data.questions_version) {
        const jsonStr = localStorage.getItem(USER_DEAFULT_KEY.QUESTION_DATA);
        const json = JSON.parse(jsonStr);
        if ((json?.data ?? []).length == 0) {
          const questions = GET_LOCAL_QUESTIONS();
          // setQuestionsList(questions)
        } else {
          // setQuestionsList(json?.data ?? [])
        }
      } else {
        await fetchQuestions(data.questions_version);
      }
    }
  }

  async function fetchQuestions(version) {
    try {
      const questions = await GET_QUESTIONS();
      if (questions.data.length > 0) {
        const jsonStr = JSON.stringify(questions);
        localStorage.setItem(
          USER_DEAFULT_KEY.QUESTION_VERSION,
          version.toString()
        );
        localStorage.setItem(USER_DEAFULT_KEY.QUESTION_DATA, jsonStr);
        // setQuestionsList(questions.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getProfileDetails(all_question_scores, exist) {
    const result = await GET_USER_PROFILE();
    if (result.status) {
      if (result.isUserExist) {
        setProfile(result.data);
        await getSubscriptionDetails(result.data);

        if (isFromLoginSignup) {
          const name =
            (result?.data?.auth_first_name ?? "") +
            " " +
            (result?.data?.auth_last_name ?? "");
          trackLogin(loginSignupType, name);
          UPDATE_USER_AUTH_DETAILS();
        }

        if (!result?.data?.readiness_scores) {
          moveToUpdateScore();
        } else if (!exist) {
          moveToUpdateQuestions();
        } else {
          moveToHome(all_question_scores);
        }
      } else {
        const data = {
          auth_first_name: firstName ?? auth()?.currentUser?.displayName ?? "",
          auth_last_name: lastName,
          auth_email: auth().currentUser.email,
          auth_login_provider:
            auth().currentUser?.providerData[0]?.providerId ?? "",
          last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
          flashcard_bookmarks: [],
          flashcards_progress: [],
          practice_test_history: [],
          question_bookmarks: [],
          questions_progress: [],
          quiz_of_the_day_reminder: true,
          signup_date: auth().currentUser.metadata?.creationTime ?? "",
          study_plan_reminder: true,
          profile_pic: "",
          readiness_scores: null,
          score_progress: {},
        };
        setNewProfile(data);

        if (isFromLoginSignup) {
          const name = firstName + " " + lastName;
          trackSignup(loginSignupType, name);
          UPDATE_USER_AUTH_DETAILS();
        }

        moveToSubscription();
      }
    } else {
      SHOW_TOAST(result.error, "error");
    }
  }

  async function moveToUpdateQuestions() {
    navigation("/bookmark");
    window.location.reload();
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.UpdateAllQuestions.identifier }
    //         ],
    //     })
    // );
  }

  async function moveToUpdateScore() {
    navigation("/home");
    window.location.reload();
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.UpdateReadinessScore.identifier }
    //         ],
    //     })
    // );
  }

  async function moveToHome(all_question_scores) {
    const isAssesment = all_question_scores?.length == 0 ? true : false;
    navigation("/home");
    window.location.reload();
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             {
    //                 name: SCREENS.Tabbar.identifier, params: {
    //                     isAssesment: isAssesment
    //                 }
    //             }
    //         ],
    //     })
    // );
  }

  async function moveToSubscription() {
    window.location.reload();
    navigation("/chooseplan", {
      state: {
        params: {
          canSkip: true,
          source: "onboarding",
          is_app_selection: true,
        },
      },
    });

    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.ChoosePlan.identifier, params: { canSkip: true, source: 'onboarding', is_app_selection: true } }
    //         ],
    //     })
    // );
  }

  return (
    <LAView type="full-screen-center" flex="col" background="regular">
      <Rings
        height="80"
        width="80"
        color="#007054"
        radius="6"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="rings-loading"
      />
      <LAText
        className="mt-3"
        size="small"
        font="400"
        color={"black"}
        title={STRINGS.prepare_message}
      ></LAText>
    </LAView>
  );
}

export default Prepare;
