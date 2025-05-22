import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { BundleContext } from "../context/BundleProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { auth } from "../api/config";
import {
  GET_BUNDLE_PROFILE,
  GET_USER_PROFILE,
  STORE_AUTH_DETAILS,
  UPDATE_USER_AUTH_DETAILS,
} from "../api/firebase_user";
import {
  GET_APP_CONFIG,
  GET_COMMUNITY_DATA,
  GET_QUESTIONS,
} from "../api/community";
import {
  BUNDLE_APP_NAME,
  GET_QUESTION_VERSION_OF_JSON,
} from "../../app_constant";
import { SHOW_TOAST } from "../constant/utils";
import { GET_LOCAL_QUESTIONS } from "../api/content";
import { USER_DEAFULT_KEY } from "../constant/event";
import { GET_SCORE_QUESTIONS } from "../api/questions";
import { useLocation, useNavigate } from "react-router-dom";
import { LAText, LAView } from "../components";
import { Rings } from "react-loader-spinner";
import { STRINGS } from "../constant";
import { MixpanelContext } from "../context/MixpanelProvider";
import ChangeExam from "../components/popup/ChangeExam";

const PrepareBundle = (props) => {
  const { state } = useLocation();
  const firstName = state?.params?.firstName ?? "";
  const lastName = state?.params?.lastName ?? "";
  const isFromOnboarding = state?.params?.isFromOnboarding ?? false;
  const isFromLoginSignup = state?.params?.isFromLoginSignup ?? false;
  const loginSignupType = state?.params?.type ?? "";
  const navigation = useNavigate();
  const {
    setProfile,
    setNewProfile,
    setCommunityData,
    setQuestionsList,
    getSubscriptionDetails,
    setVisibleCommunity,
    setBundleProfile,
    setNewBundleProfile,
    setAllQuestionData,
  } = useContext(AuthContext);
  const { trackOpenApp, trackLogin, trackSignup } = useContext(MixpanelContext);
  const { setSelectedBundle } = useContext(BundleContext);
  const { theme } = useContext(ThemeContext);
  const getStateFromLocalStorage = () => {
    const savedState = localStorage.getItem("appState");
    return savedState ? JSON.parse(savedState) : null;
  };
  const [appState, setAppState] = useState(
    getStateFromLocalStorage() || "INITIAL_STATE"
  );
  const [isChangeDialog, setChangeDialog] = useState(false);

  const reloadPage = async () => {
    const appState = await GET_USER_PROFILE();
    saveStateToLocalStorage(appState);
    window.location.reload();
  };
  useEffect(() => {
    initFirebase();
    if (isChangeDialog && isFromOnboarding) {
    } else {
      // const timeoutId = setTimeout(reloadPage, 1000);
      // return () => clearTimeout(timeoutId);
    }
  }, []);

  async function initFirebase() {
    if (isFromOnboarding == false) {
      trackOpenApp();
    }
    // window.location.reload();
    if (auth()?.currentUser && auth()?.currentUser?.uid) {
      getSelectedCertificate();
    } else {
      moveToLogin();
    }
  }

  async function getSelectedCertificate() {
    const result = await GET_BUNDLE_PROFILE();
    const certificate = result?.data?.current_certificate;
    const selectedBundle = localStorage.getItem(
      USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS
    );

    if (certificate) {
      if (selectedBundle) {
        setSelectedBundle(result?.data?.current_certificate ?? "");

        // setupPurchase();

        storeAuthData(certificate);
        await getAppConfig(certificate);
        await getCommunities(certificate);
        const res = await getScoreQuestions(certificate);
        const bundleProfile = await getBundleDetails();
        await getProfileDetails(
          certificate,
          res.data,
          res.exist,
          bundleProfile
        );

        // moveToSubscription();
        moveToUpdateQuestions();
        moveToHome();

        // console.log("move to subscribe 1");
      } else {
        setSelectedBundle(result?.data?.current_certificate ?? "");
        localStorage.setItem(
          "SAVED_BUNDLE_DETAILS",
          result?.data?.current_certificate
        );
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      setChangeDialog(true);
    }
  }

  async function getAppConfig() {
    const result = await GET_APP_CONFIG();
    if (result.status && result.data) {
      const isVisible = result?.data?.visible_community ?? false;
      setVisibleCommunity(isVisible);
    } else {
      setVisibleCommunity(false);
    }
  }

  function storeAuthData() {
    STORE_AUTH_DETAILS(BUNDLE_APP_NAME);
  }

  async function getBundleDetails() {
    const result = await GET_BUNDLE_PROFILE();

    const certificate = result?.data?.current_certificate;
    if (result.status) {
      if (result.isUserExist) {
        setBundleProfile(result.data);
        return result.data;
      } else {
        const data = {
          auth_first_name: firstName,
          auth_last_name: lastName,
          auth_email: auth().currentUser.email,
          auth_login_provider:
            auth().currentUser?.providerData[0]?.providerId ?? "",
          last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
          signup_date: auth().currentUser.metadata?.creationTime ?? "",
          current_certificate: certificate,
        };
        setNewBundleProfile(data);
        return data;
      }
    } else {
      SHOW_TOAST(result.error, "warning");
      return null;
    }
  }

  async function getProfileDetails(
    certificate,
    all_question_scores,
    exist,
    bundleProfile
  ) {
    const result = await GET_USER_PROFILE();

    if (result.status) {
      if (result.isUserExist) {
        setProfile(result.data);

        await getSubscriptionDetails(bundleProfile);

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
        if (certificate.toLowerCase() === 'cissp') {
          data.isQuestionLatestVersionUpdated = true;
      }
        setNewProfile(data);

        if (isFromLoginSignup) {
          const name = data?.firstName + " " + data?.lastName;
          trackSignup(loginSignupType, name);
          // UPDATE_USER_AUTH_DETAILS();
        }

        const isSubscribePlan = await getSubscriptionDetails(bundleProfile);
        if (isSubscribePlan) {
          moveToHome();
        } else {
          moveToSubscription();
        }
      }
    } else {
      SHOW_TOAST(result.error);
    }
  }

  async function getCommunities(certificate) {
    const result_community = await GET_COMMUNITY_DATA();
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
      setCommunityData(data);

      let jsonVersion = await GET_QUESTION_VERSION_OF_JSON();
      let savedVersion = localStorage.getItem(
        USER_DEAFULT_KEY.QUESTION_VERSION + certificate
      );
      if (jsonVersion >= data.questions_version) {
        const questions = GET_LOCAL_QUESTIONS(certificate);
        setQuestionsList(questions);
      } else if (savedVersion && savedVersion == data.questions_version) {
        const jsonStr = localStorage.getItem(
          USER_DEAFULT_KEY.QUESTION_DATA + certificate
        );
        const json = JSON.parse(jsonStr);
        if ((json?.data ?? []).length == 0) {
          const questions = GET_LOCAL_QUESTIONS(certificate);
          setQuestionsList(questions);
        } else {
          setQuestionsList(json?.data ?? []);
        }
      } else {
        await fetchQuestions(data.questions_version, certificate);
      }
    }
  }

  async function getScoreQuestions() {
    const result = await GET_SCORE_QUESTIONS();
    setAllQuestionData(result?.data ?? []);
    return { data: result?.data ?? [], exist: result.isExist };
  }

  async function fetchQuestions(version, certificate) {
    try {
      const questions = await GET_QUESTIONS(certificate);
      if (questions.data.length > 0) {
        const jsonStr = JSON.stringify(questions);
        localStorage.setItem(
          USER_DEAFULT_KEY.QUESTION_VERSION + certificate,
          version.toString()
        );
        localStorage.setItem(USER_DEAFULT_KEY.QUESTION_DATA, jsonStr);
        setQuestionsList(questions.data);
      } else {
        const questions = GET_LOCAL_QUESTIONS(certificate);
        setQuestionsList(questions);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const saveStateToLocalStorage = (state) => {
    localStorage.setItem("appState", JSON.stringify(state));
  };

  async function reload() {
    const appState = await GET_USER_PROFILE();
    saveStateToLocalStorage(appState);
    props.handleReload();
    // window.location.reload();
  }

  async function moveToLogin() {
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.Leading.identifier }
    //         ],
    //     })
    // );
    // window.location.reload();
    navigation("/login");
  }

  async function moveToSubscription() {
    // window.location.reload();
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.ChoosePlan.identifier, params: { canSkip: true, source: 'onboarding', is_app_selection: true } }
    //         ],
    //     })
    // );
    // window.location.reload();
    // reloadPage();
    navigation("/chooseplan");
  }

  async function moveToUpdateScore() {
    // window.location.reload();
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.UpdateReadinessScore.identifier }
    //         ],
    //     })
    // );

    // reloadPage();
    navigation("/updaterediness");
  }

  async function moveToUpdateQuestions() {
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             { name: SCREENS.UpdateAllQuestions.identifier }
    //         ],
    //     })
    // );
    navigation("/updateallquestions");
  }

  async function moveToHome(all_question_scores) {
    const isAssesment = all_question_scores?.length == 0 ? true : false;
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
    // reload();
    window.location.reload();
    navigation("/home", { state: { isAssesment: isAssesment } });
  }

  const handleChange = (value) => {
    // console.log(value);
  };

  return (
    <>
      <LAView type="full-screen-center" flex="col" background="regular">
        <Rings
          height="80"
          width="80"
          color={theme?.THEME_DARK}
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
      {isChangeDialog && (
        <ChangeExam
          show={isChangeDialog}
          hideCancle={true}
          onCancle={() => {
            setChangeDialog(false);
          }}
          isFirst={true}
          onPress={(e, index) => {
            // console.log(e, index, "change pressed");
          }}
          options={["change"]}
          title={STRINGS.change_bundle}
          desc={STRINGS.change_bundle_messge}
          handleChange={handleChange}
        />
      )}
    </>
  );
};

export default PrepareBundle;
