import React, { createContext, useContext } from "react";
import moment from "moment";
// import auth from "@react-native-firebase/auth";
// import { Platform } from "react-native";

import { BundleContext } from "./BundleProvider";
import { MIXPANEL_EVENTS } from "../constant/utils";
import { GET_APP_NAME, BUNDLE_APP_NAME } from "../../app_constant";
import { auth } from "../api/config";
import mixpanel from "mixpanel-browser";

// const mixpanel = new Mixpanel(THIRD_PARTY_CONFIG.MIXPANEL_TOKEN);

// mixpanel.init();
// mixpanel.setLoggingEnabled(true);

export const MixpanelContext = createContext();

export const MixpanelProvider = (props) => {
  // mixpanel.init(THIRD_PARTY_CONFIG.MIXPANEL_TOKEN, {
  //   debug: true,
  //   track_pageview: true,
  //   persistence: "localStorage",
  // });

  //console.log("process.env.REACT_APP_MIXPANEL_TOKEN", `${process.env.REACT_APP_MIXPANEL_TOKEN}`);
  mixpanel.init(`${process.env.REACT_APP_MIXPANEL_TOKEN}`);
  // mixpanel.setLoggingEnabled(true);
  const { selectedCertificate } = useContext(BundleContext);

  let user = auth().currentUser;
  const email = user ? user.email : null;
  const firebaseId = user ? user.uid : null;
  //const BUNDLE_APP_NAME = BUNDLE_APP_NAME;
  const APP_NAME = GET_APP_NAME(selectedCertificate);
  const platform = "Web";

  const superProperties = {
    platform: platform,
    app_name: BUNDLE_APP_NAME,
    certification: APP_NAME,
    email: email,
    firebaseId: firebaseId,
  };

 
  function trackOpenApp() {
    mixpanel.track(MIXPANEL_EVENTS.OPEN_APP, superProperties);

    mixpanel.register(superProperties);

    if (user) {
      mixpanel.identify(firebaseId);
      mixpanel.register({ email: email, firebaseId: firebaseId});
      mixpanel.people.set({
        $email: email,
        firebaseId: user.uid,
        last_open_date: moment().format("DD/MM/YYYY hh:mm A"),
      });
    }
  }

  function trackOnboardingScreenView(number) {
    const data = {
      ...superProperties,
      screen_number: number,
    };

    mixpanel.track(MIXPANEL_EVENTS.ONBOARDING_SCREEN_VIEW, data);
  }

  function trackOnboardingSingup(type) {
    const data = {
      ...superProperties,
      signup_type: type,
    };

    mixpanel.track(MIXPANEL_EVENTS.ONBOARDING_SIGNUP_CLICK, data);
  }

  function trackLogin(type, name) {
    if (user) {
      mixpanel.people.set({
        last_login_date: moment().format("DD/MM/YYYY hh:mm A"),
        $name: name,
        $email: user.email,
      });

      const data = {
        ...superProperties,
        name: name,
        login_type: type,
      };
      mixpanel.track(MIXPANEL_EVENTS.LOGIN, data);
    }
  }

  function trackSignup(type, name) {
    if (user) {
      mixpanel.people.set({
        id: user.id,
        $name: name,
        $email: user.email,
        signup_type: type,
        signup_date: moment().format("DD/MM/YYYY hh:mm A"),
      });

      const data = {
        ...superProperties,
        signup_type: type,
        signup_date: moment().format("DD MMM YYYY hh:mm a"),
      };
      mixpanel.track(MIXPANEL_EVENTS.SIGNUP, data);
    }
  }

  function trackForgotPassword(email) {
    const data = {
      ...superProperties
    };
    mixpanel.track(MIXPANEL_EVENTS.FORGOT_PASSWORD, data);
  }

  function trackOnboardingAssessment(assessment_type) {
    const data = {
      ...superProperties,
      assessment_type: assessment_type,
    };
    mixpanel.track(MIXPANEL_EVENTS.ASSESSMENT_TYPE, data);
  }

  function trackHome() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_HOME, superProperties);
  }

  function trackDashboard() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_DASHBOARD, superProperties);
  }

  function trackHistory() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_HISTORY, superProperties);
  }

  function trackBookmark() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_BOOKMARK, superProperties);
  }

  function trackAcronyms() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_ACRONYMS, superProperties);
  }

  function trackGlossary() {
    mixpanel.track(MIXPANEL_EVENTS.VIEW_GLOSSARY, superProperties);
  }

  function trackSubscription(source, plan, status) {
    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key_plan = APP_NAME + " Subscription Plan";

    mixpanel.register({ [`${key_plan}`]: plan });

    mixpanel.people.set({
      [`${key_plan}`]: plan,
      last_subscription_date: moment().format("DD MMM YYYY hh:mm a"),
    });

    const data = {
      source: source,
      [`${key_plan}`]: plan,
      result: status,
      subscription_date: moment().format("DD MMM YYYY hh:mm a"),
    };

    mixpanel.track(MIXPANEL_EVENTS.SUBSCRIPTION, data);
  }

  function trackStudyQuestions(type) {
    const data = {
      ...superProperties,
      type: type,
    };

    mixpanel.track(MIXPANEL_EVENTS.STUDY_QUESTIONS, data);
  }

  function trackFlashcard(type) {
    const data = {
      ...superProperties,
      type: type,
    };

    mixpanel.track(MIXPANEL_EVENTS.FLASH_CARD, data);
  }

  function trackCustomTest(
    domain_ids,
    domain_names,
    questions,
    time,
    isAnswer,
    priority
  ) {
    const data = {
      ...superProperties,
      domains_selected: domain_ids,
      domains_names: domain_names,
      questions: questions,
      time: time,
      show_answer: isAnswer,
      priority: priority,
    };

    mixpanel.track(MIXPANEL_EVENTS.CUSTOM_TEST, data);
  }

  function trackReadinessScore(scores) {
    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key_score = APP_NAME + " Readiness Score";
    let key_questions = APP_NAME + " Questions Answered";
    mixpanel.people.increment(`${key_questions}`, 1);
    mixpanel.people.set({
      [`${key_score}`]: scores,
    });
  }

  function trackFlashcardRecord(total) {
    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key = APP_NAME + " Flashcards Answered";
    mixpanel.people.increment(`${key}`, 1);
  }

  function trackPracticeExit(testName, totalQuestions, attemptedQuestion) {
    const data = {
      ...superProperties,
      test_name: testName,
      number_of_questions: totalQuestions,
      attempted_of_questions: attemptedQuestion,
    };
    mixpanel.track(MIXPANEL_EVENTS.PRACTICE_TEST_ABANDONED, data);
  }

  function trackPracticeCompleted(
    testName,
    totalQuestions,
    attemptedQuestion,
    scores
  ) {
    const data = {
      ...superProperties,
      test_name: testName,
      number_of_questions: totalQuestions,
      attempted_of_questions: attemptedQuestion,
    };
    mixpanel.track(MIXPANEL_EVENTS.PRACTICE_TEST_COMPLETED, data);

    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key_score = APP_NAME + " Readiness Score";
    let key_test = APP_NAME + " Test Taken";
    let key_questions = APP_NAME + " Questions Answered";
    mixpanel.people.increment(`${key_test}`, 1);
    mixpanel.people.increment(`${key_questions}`, attemptedQuestion);
    mixpanel.people.set({
      [`${key_score}`]: scores,
    });
  }

  function trackPracticeReview(type) {
    const data = {
      ...superProperties,
      review_type: type,
    };
    mixpanel.track(MIXPANEL_EVENTS.PRACTICE_TEST_REVIEW, data);
  }

  function trackQuestionBookmark(value) {
    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key_bookmarked = APP_NAME + " Questions Bookmared";
    mixpanel.people.increment(`${key_bookmarked}`, value);
  }

  function trackFlashcardBookmark(value) {
    const APP_NAME = GET_APP_NAME(selectedCertificate);
    let key_bookmarked = APP_NAME + " Flashcards Bookmared";
    mixpanel.people.increment(`${key_bookmarked}`, value);
  }

  function trackAccountSetting() {
    mixpanel.track(MIXPANEL_EVENTS.ACCOUNT_SETTING, superProperties);
  }

  function trackAppAppearanceSetting() {
    mixpanel.track(MIXPANEL_EVENTS.APP_APPEARANCE, superProperties);
  }

  function trackResetApp() {
    mixpanel.track(MIXPANEL_EVENTS.RESET_APP_DATA, superProperties);
  }

  function trackShareApp() {
    mixpanel.track(MIXPANEL_EVENTS.SHARE_APP, superProperties);
  }

  function trackReviewFromHome() {
    mixpanel.track(MIXPANEL_EVENTS.OPEN_REVIEW_FROM_HOME, superProperties);
  }

  function trackReviewApp() {
    mixpanel.track(MIXPANEL_EVENTS.REVIEW_APP, superProperties);
  }

  function trackNeedWork() {
    mixpanel.track(MIXPANEL_EVENTS.NEED_WORK_REVIEW, superProperties);
  }

  function trackLoveIt() {
    mixpanel.track(MIXPANEL_EVENTS.LOVE_IT_REVIEW, superProperties);
  }

  function trackNotReviewYet() {
    mixpanel.track(MIXPANEL_EVENTS.NOT_REVIEW_YET, superProperties);
  }

  function trackOtherApp() {
    mixpanel.track(MIXPANEL_EVENTS.OTHERS_APP, superProperties);
  }

  function trackHelp() {
    mixpanel.track(MIXPANEL_EVENTS.HELP_SUPPORT, superProperties);
  }

  function resetMixpanel() {
    mixpanel.reset();
    // mixpanel.clearSuperProperties();
  }

  return (
    <MixpanelContext.Provider
      value={{
        trackOpenApp,
        trackOnboardingScreenView,
        trackOnboardingSingup,
        trackLogin,
        trackSignup,
        trackForgotPassword,
        trackOnboardingAssessment,
        trackHome,
        trackDashboard,
        trackHistory,
        trackBookmark,
        trackAcronyms,
        trackGlossary,
        trackSubscription,
        trackStudyQuestions,
        trackFlashcard,
        trackCustomTest,
        trackReadinessScore,
        trackFlashcardRecord,
        trackPracticeExit,
        trackPracticeCompleted,
        trackPracticeReview,
        trackQuestionBookmark,
        trackFlashcardBookmark,
        trackAccountSetting,
        trackAppAppearanceSetting,
        trackResetApp,
        trackShareApp,
        trackReviewApp,
        trackOtherApp,
        trackHelp,
        resetMixpanel,
        trackNeedWork,
        trackLoveIt,
        trackReviewFromHome,
        trackNotReviewYet,
      }}
    >
      {props.children}
    </MixpanelContext.Provider>
  );
};
