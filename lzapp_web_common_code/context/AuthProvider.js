import React, {
  createContext,
  useEffect,
  useReducer,
  useState,
  useContext,
} from "react";
//REDUCER
import {
  BundleReducer,
  CommunityReducer,
  ProfileReducer,
  QuestionReducer,
} from "../reducers";

//CONSTANT
import { ACTION_EVENT } from "../constant/event";
import {
  BUNDLE_APP_NAME,
  GET_APP_DOMAIN_LIST,
  GET_APP_NAME,
  IS_BUNDLE_APP,
} from "../../app_constant";

//API
import { UPDATE_SUBSCRIPTION } from "../api/community";
import {
  GET_STRIPE_DETAILS,
  GET_USER_STRIPE_ONE_TIME_PAYMENT,
  UPDATE_USER_SUBSCRIPTION,
  GET_REVENUECAT_EVENTS,
  GET_REVENUECAT_METADATA,
  GET_REVENUECAT_SUBSCRIPTION_PLAN,
} from "../api/firebase_user";
import { GET_SCORE_QUESTIONS, SAVE_QUESTION } from "../api/questions";
import {
  GET_ACCESS_CODE_DETAILS,
  UPDATE_ACCESS_CODE_REDEEM,
} from "../api/access_code";

//CONTENT
import { GET_LOCAL_QUESTIONS } from "../api/content";

//CONTEXT
import { BundleContext } from "./BundleProvider";

//PACKAGES
import { auth, firestore } from "../api/config";

import moment from "moment";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const { selectedCertificate } = useContext(BundleContext);

  const [bundleData, dispatchBundle] = useReducer(
    BundleReducer.reducer,
    BundleReducer.initial
  );
  const [profile, dispatch] = useReducer(
    ProfileReducer.reducer,
    ProfileReducer.initial
  );
  const [community, dispatchCommunity] = useReducer(
    CommunityReducer.reducer,
    CommunityReducer.initial
  );
  const [questionScrore, dispatchQuestionScore] = useReducer(
    QuestionReducer.reducer,
    QuestionReducer.initial
  );

  async function getScoreQuestions() {
    const result = await GET_SCORE_QUESTIONS();
    setAllQuestionData(result?.data ?? []);
    dispatchQuestionScore({
      type: ACTION_EVENT.SET_ALL_QUESTION_SCORE,
      payload: result?.data ?? [],
    });
    return { data: result?.data ?? [], exist: result.isExist };
  }

  useEffect(() => {
    getScoreQuestions();
  }, []);

  const [questionsList, setQuestionsList] = useState([]);
  const [isSubscribe, setSubscription] = useState(false);
  const [isVisibleCommunity, setVisibleCommunity] = useState(false);

  useEffect(() => {
    const uid = auth().currentUser?.uid;
    const unsubscribe = firestore()
      .collection("customers")
      .doc(uid)
      .collection("subscriptions")
      .onSnapshot((snapshot) => {
        const updateData = [];
        snapshot.forEach((doc) => {
          updateData.push({ id: doc.id, ...doc.data() });
        });
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const QUESTIONS_LIST = GET_LOCAL_QUESTIONS(selectedCertificate);
    setQuestionsList(QUESTIONS_LIST);
  }, [selectedCertificate]);

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        const APP_NAME = GET_APP_NAME(selectedCertificate);

        const unsubscribeProfile = firestore()
          .collection("apps")
          .doc(APP_NAME)
          .collection("users")
          .doc(user.uid)
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              setProfile(snapshot.data());
            }
          });

          const unsubscribeQuestions = firestore()
          .collection("apps")
          .doc(APP_NAME)
          .collection("users")
          .doc(user.uid)
          .collection("questions")
          .onSnapshot((querySnapshot) => {
              const questions = [];
              querySnapshot.forEach((doc) => {
                  questions.push(doc.data());
              });
              setQuestions(questions);
          });
      

        const unsubscribeAppConfig = firestore()
          .collection("apps")
          .doc(APP_NAME)
          .collection("APP")
          .doc("CONFIG")
          .onSnapshot((snapshot) => {
            if (snapshot.exists) {
              setVisibleCommunity(snapshot.data()?.visible_community ?? false);
            }
          });

        let unsubscribeBundle = null;
        if (IS_BUNDLE_APP) {
          unsubscribeBundle = firestore()
            .collection("apps")
            .doc(BUNDLE_APP_NAME)
            .collection("users")
            .doc(user.uid)
            .onSnapshot((snapshot) => {
              if (snapshot.exists) {
                setBundleProfile(snapshot.data());
              }
            });
        }

        return () => {
          unsubscribeProfile();
          unsubscribeQuestions();
          unsubscribeBundle && unsubscribeBundle();
          unsubscribeAppConfig();
        };
      }
    });

    return () => unsubscribeAuth();
  }, [selectedCertificate]);

  // Utility functions
const normalizeExpirationDate = (expirationDate) => {
  let expirationMs = new Date(expirationDate).getTime();
  return expirationMs < 1e12 ? expirationMs * 1000 : expirationMs;
};

const isSubscriptionActive = (expirationDate) => {
  return normalizeExpirationDate(expirationDate) > Date.now();
};

const isSubscriptionMetadataComplete = (subscription) => {
  return subscription?.paymentMode && 
         subscription?.paymentType && 
         subscription?.plan;
};

const updateSubscription = async (data) => {
  await UPDATE_USER_SUBSCRIPTION({ subscription: data });
  setSubscription(true);
};

 const checkRevenueCatSubscription = async () => {
  const name = await GET_APP_NAME();
  const appName = IS_BUNDLE_APP ? BUNDLE_APP_NAME : name;
  const metadata = await GET_REVENUECAT_METADATA(appName);
  
  if (!metadata.status) return false;
  if (!metadata?.data?.length) return false;

  const allProductIds = metadata.data.map(item => item.id);
  const events = await GET_REVENUECAT_EVENTS();

  if (!events?.status || events?.data?.length === 0) return false;

  const eventForThisApp = events.data.filter((e) => allProductIds.includes(e.product_id));
  if (eventForThisApp.length === 0) {
    return false;
  }
  const latestEvent = eventForThisApp.sort((a, b) => b.event_timestamp_ms - a.event_timestamp_ms)[0];
  const expirationDate = latestEvent.expiration_at_ms;
  
  if (!isSubscriptionActive(expirationDate)) return false;

  const planResult = await GET_REVENUECAT_SUBSCRIPTION_PLAN(latestEvent.product_id);
  if (!planResult.status) {
      console.error(planResult.error);
      return false;
  }
  
  await updateSubscription({
      subscription_expiration: expirationDate,
      paymentMode: latestEvent.store,
      paymentType: "recurring",
      plan: planResult.data
  });
  
  return true;
}; 


 const checkStripeSubscription = async () => {
  const uid = auth().currentUser?.uid;
  if (!uid) return false;

  const resStripe = await GET_STRIPE_DETAILS(uid);
  console.log('resStripe', resStripe);
  if (!resStripe?.data) return false;

  const activeSubscription = resStripe.data.find(ele => ele.status === "active");
  if (!activeSubscription) return false;

  const expirationDate = normalizeExpirationDate(activeSubscription.current_period_end.toDate());
  
  if (!isSubscriptionActive(expirationDate)) return false;
  console.log('activeSubscription', activeSubscription);

   const { interval, interval_count } = activeSubscription.priceDetails;
   const plan = getPlanFromInterval(interval, interval_count);

   await updateSubscription({
     subscription_expiration: expirationDate,
     paymentMode: "stripe",
     paymentType: "recurring",
     plan: plan
   });

   return true;
  
}; 
const getPlanFromInterval = (interval, intervalCount) => {
  console.log('interval', interval);
  console.log('intervalCount', intervalCount);
  interval = interval.toLowerCase();
  if (interval === 'month') {
      if (intervalCount === 1) return 'Monthly';
      if (intervalCount === 3) return 'Quarterly';
      if (intervalCount === 6) return 'Semi-Annual';
  }
  if (interval === 'year') return 'Annual';
  return `${intervalCount} ${interval}(s)`;
};

const checkStripeOneTimePayment = async () => {
  const uid = auth().currentUser?.uid;
  if (!uid) return false;

  const oneTimePayment = await GET_USER_STRIPE_ONE_TIME_PAYMENT(uid);
  const successfulOneTimePayments = oneTimePayment?.data?.filter(ele => 
      ele?.status === "succeeded" &&
      ele?.description !== "Subscription creation" &&
      ele?.description !== "Subscription update"
  );

  if (!successfulOneTimePayments?.length) return false;

  const latestPayment = successfulOneTimePayments[0];
  const createdTime = normalizeExpirationDate(latestPayment.created);
  const periodMonths = parseInt(latestPayment.priceData?.description, 10);

  if (isNaN(periodMonths)) return false;

  const expirationDate = new Date(createdTime);
  expirationDate.setMonth(expirationDate.getMonth() + periodMonths);

  if (!isSubscriptionActive(expirationDate)) return false;

  await updateSubscription({
      subscription_expiration: expirationDate.getTime(),
      paymentMode: "stripe",
      paymentType: "one_time",
      plan: `${periodMonths}-month`
  });

  return true;
};


async function getSubscriptionDetails(result) {
  console.log('Checking subscription status...');
  try {
      let isSubscribed = false;
      const currentSubscription = result?.subscription;

      // Check if subscription is active and has complete metadata
      if (currentSubscription?.subscription_expiration) {
          isSubscribed = isSubscriptionActive(currentSubscription.subscription_expiration);
          
          // If subscription is active but missing metadata, run checks to update the fields
          if (isSubscribed && !isSubscriptionMetadataComplete(currentSubscription)) {
              await checkRevenueCatSubscription() ||
              await checkStripeSubscription() ||
              await checkStripeOneTimePayment();
          }
      }

      // If not subscribed or subscription expired, run all checks
      if (!isSubscribed) {
          isSubscribed = await checkRevenueCatSubscription() ||
                        await checkStripeSubscription() ||
                        await checkStripeOneTimePayment();
      }

      setSubscription(isSubscribed);
      return isSubscribed;
  } catch (err) {
      console.error('Subscription check failed:', err);
      setSubscription(false);
      return false;
  }
}

  function setProfile(data) {
    dispatch({ type: ACTION_EVENT.SET_PROFILE, payload: data });
  }

  function setQuestions(questions) {
    dispatchQuestionScore({type: ACTION_EVENT.SET_ALL_QUESTION_SCORE, payload: questions ?? [],});
  }

  function setBundleProfile(data) {
    dispatchBundle({ type: ACTION_EVENT.SET_PROFILE, payload: data });
  }

  function setNewProfile(data) {
    dispatch({ type: ACTION_EVENT.SET_NEW_PROFILE, payload: data });
  }

  function setNewBundleProfile(data) {
    dispatchBundle({ type: ACTION_EVENT.SET_NEW_PROFILE, payload: data });
  }

  function setNotification(quiz, study) {
    dispatch({ type: ACTION_EVENT.SET_NOTIFICATION, payload: { quiz, study } });
  }

  function setProfileDetails(firstName, lastName) {
    if (IS_BUNDLE_APP) {
      dispatchBundle({
        type: ACTION_EVENT.SET_PROFILE_DETAILS,
        payload: { firstName, lastName },
      });
    } else {
      dispatch({
        type: ACTION_EVENT.SET_PROFILE_DETAILS,
        payload: { firstName, lastName },
      });
    }
  }

  function setProfilePicture(url) {
    dispatch({
      type: ACTION_EVENT.SET_PROFILE_PICTURE,
      payload: { profile_pic: url },
    });
  }

  function setBundleProfilePicture(url) {
    dispatchBundle({
      type: ACTION_EVENT.SET_PROFILE_PICTURE,
      payload: { profile_pic: url },
    });
  }

  function setTestOptions(time_per_question, allow_go_back) {
    dispatch({
      type: ACTION_EVENT.SET_PROFILE_TEST_OPTIONS,
      payload: {
        time_per_question: time_per_question,
        allow_go_back: allow_go_back,
      },
    });
  }

  function setFontsOptions(font_size) {
    dispatch({
      type: ACTION_EVENT.SET_PROFILE_FONT_OPTIONS,
      payload: {
        font_size: font_size,
      },
    });
  }

  function setTestHistory(data) {
    dispatch({ type: ACTION_EVENT.SET_TEST_HISTORY, payload: data });
  }

  function deleteTestHistory(data) {
    dispatch({ type: ACTION_EVENT.DELETE_TEST_HISOTRY, payload: data });
  }

  function addFlashcardToBookmark(id) {
    dispatch({ type: ACTION_EVENT.ADD_FLASHCARD_TO_BOOKMARK, payload: id });
  }

  function removeFlashcardFromBookmark(id) {
    dispatch({
      type: ACTION_EVENT.REMOVE_FLASHCARD_FROM_BOOKMARK,
      payload: id,
    });
  }

  function addFlashcardProgress(setId, cardId) {
    const data = {
      flashcard_set_id: setId,
      last_seen_flashcard_id: cardId,
    };
    dispatch({ type: ACTION_EVENT.ADD_FLASHCARD_PROGRESS, payload: data });
  }

  function addQuestionToBookmark(id) {
    dispatch({ type: ACTION_EVENT.ADD_QUESTION_TO_BOOKMARK, payload: id });
  }

  function removeQuestionFromBookmark(id) {
    dispatch({ type: ACTION_EVENT.REMOVE_QUESTION_FROM_BOOKMARK, payload: id });
  }

  function addQuestionProgress(setId, questionId) {
    const data = {
      study_questions_set_id: setId,
      last_seen_question_id: questionId,
    };
    dispatch({ type: ACTION_EVENT.ADD_QUESTION_PROGRESS, payload: data });
  }

  function addQuestionScore(question_id, topic_id, correct) {
    // getScoreQuestions();

    const domains = GET_APP_DOMAIN_LIST(selectedCertificate);
    const data = {
      question_id: question_id,
      topic_id: topic_id,
      correct: correct,
      questionsList: questionsList,
      app_domains: domains,
    };

    let scores = questionScrore?.all_questions_scrores ?? [];
    //console.log("scores", scores);
    const savedList = scores.filter((item) => item.question_id == question_id);
    const saveItem = savedList.length > 0 ? savedList[0] : null;
    if (saveItem) {
      const score = correct ? saveItem.score + 1 : 0;
      const data = {
        question_id: question_id,
        topic_id: topic_id,
        times_answered: saveItem.times_answered + 1,
        last_seen: moment().format("YYYY MM DD HH:mm:ss"),
        score: score < 0 ? 0 : score,
        accuracy_score: score == 0 ? 0 : score == 1 ? 0.9 : 1,
      };
      SAVE_QUESTION(data);
      scores = scores.filter((item) => item.question_id != question_id);
      scores.push(data);
    } else {
      const score = correct ? 1 : 0;
      const data = {
        question_id: question_id,
        topic_id: topic_id,
        times_answered: 1,
        last_seen: moment().format("YYYY MM DD HH:mm:ss"),
        score: score,
        accuracy_score: score == 1 ? 0.9 : 0,
      };
      SAVE_QUESTION(data);
      scores.push(data);
    }

    data.scores = scores;
    dispatchQuestionScore({
      type: ACTION_EVENT.SET_ALL_QUESTION_SCORE,
      payload: scores,
    });
    dispatch({ type: ACTION_EVENT.ON_UPDATE_QUESTIONS_SCROE, payload: data });
    dispatchCommunity({
      type: ACTION_EVENT.ON_UPDATE_COMMUNITY_DATA,
      payload: data,
    });
  }

  function addAllQuestionScore(history) {
    const domains = GET_APP_DOMAIN_LIST(selectedCertificate);
    const data = {
      history: history,
      questionsList: questionsList,
      app_domains: domains,
    };

    let scores = questionScrore?.all_questions_scrores ?? [];
    for (let index in history) {
      const obj = history[index];
      const savedList = scores.filter(
        (item) => item.question_id == obj.question_id
      );
      const saveItem = savedList.length > 0 ? savedList[0] : null;
      const APP_DOMAIN_LIST = domains;
      if (saveItem) {
        const score = obj.correct ? saveItem.score + 1 : 0;
        const data = {
          question_id: obj.question_id,
          topic_id: obj.topic_id,
          times_answered: saveItem.times_answered + 1,
          last_seen: moment().format("YYYY MM DD HH:mm:ss"),
          score: score < 0 ? 0 : score,
          accuracy_score: score == 0 ? 0 : score == 1 ? 0.9 : 1,
        };
        SAVE_QUESTION(data);
        scores = scores.filter((item) => item.question_id != obj.question_id);
        scores.push(data);
      } else {
        const score = obj.correct ? 1 : 0;
        const data = {
          question_id: obj.question_id,
          topic_id: obj.topic_id,
          times_answered: 1,
          last_seen: moment().format("YYYY MM DD HH:mm:ss"),
          score: score,
          accuracy_score: score == 1 ? 0.9 : 0,
        };
        SAVE_QUESTION(data);
        scores.push(data);
      }
    }

    data.scores = scores;
    dispatchQuestionScore({
      type: ACTION_EVENT.SET_ALL_QUESTION_SCORE,
      payload: scores,
    });
    dispatch({ type: ACTION_EVENT.ON_UPDATE_QUESTIONS_SCROE, payload: data });
    dispatchCommunity({
      type: ACTION_EVENT.ON_UPDATE_ALL_COMMUNITY_DATA,
      payload: data,
    });
  }

  function updateReadinessScore(data) {
    dispatch({ type: ACTION_EVENT.ON_UPDATE_QUESTIONS_SCROE, payload: data })
    //dispatchCommunity({ type: ACTION_EVENT.ON_UPDATE_COMMUNITY_DATA, payload: data })
  }

  function setCommunityData(data) {
    dispatchCommunity({ type: ACTION_EVENT.SET_COMMUNITY_DATA, payload: data });
  }

  function setAllQuestionData(data) {
    dispatchQuestionScore({
      type: ACTION_EVENT.SET_ALL_QUESTION_SCORE,
      payload: data,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        profile,
        bundleData,
        community,
        questionsList,
        isSubscribe,
        isVisibleCommunity,
        questionScrore,
        setProfile,
        setBundleProfile,
        setNewProfile,
        setNewBundleProfile,
        setNotification,
        setProfileDetails,
        setProfilePicture,
        setBundleProfilePicture,
        setTestOptions,
        setSubscription,
        setTestHistory,
        deleteTestHistory,
        addFlashcardToBookmark,
        removeFlashcardFromBookmark,
        addFlashcardProgress,
        addQuestionToBookmark,
        removeQuestionFromBookmark,
        addQuestionProgress,
        addQuestionScore,
        setCommunityData,
        setQuestionsList,
        addAllQuestionScore,
        getSubscriptionDetails,
        setVisibleCommunity,
        setFontsOptions,
        setAllQuestionData,
        updateReadinessScore
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
