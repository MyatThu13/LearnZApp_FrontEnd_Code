//CONSTANT
import { ACTION_EVENT } from "../constant/event";

//API
import {
  UPDATE_NOTIFICATION_SETTING,
  UPDATE_PROFILE_DETAILS,
  UPDATE_USER_FONTS_OPTIONS,
  UPDATE_USER_PROFILE,
  UPDATE_USER_TEST_OPTIONS,
} from "../api/firebase_user";
import {
  SAVE_FLASHCARD_BOOKMARK,
  SAVE_FLASHCARD_PROGRESS,
} from "../api/flashcard";
import { DELETE_TEST_HISTORY, SAVE_TEST_HISTORY } from "../api/practice";
import {
  SAVE_PROGRESS_DASHBOARD,
  SAVE_QUESTION,
  SAVE_QUESTION_BOOKMARK,
  SAVE_QUESTION_PROGRESS,
  SAVE_SCORE_PROGRESS,
} from "../api/questions";

//PACKAGES
import _ from "lodash";
import moment from "moment";

const userdata = localStorage.getItem("userData");
const data = JSON.parse(userdata) || null;
const initial = data
  ? data
  : {
      auth_email: "",
      auth_first_name: "",
      auth_last_name: "",
      auth_login_provider: "",
      last_signin_time: "",
      flashcard_bookmarks: [],
      flashcards_progress: [],
      practice_test_history: [],
      question_bookmarks: [],
      questions_progress: [],
      quiz_of_the_day_reminder: true,
      signup_date: "",
      study_plan_reminder: true,
      profile_pic: "",
      readiness_scores: null,
      score_progress: {},
    };

const reducer = (state, action) => {
  let newState = _.cloneDeep(state);
  if (action.type === ACTION_EVENT.SET_PROFILE) {
    const data = action?.payload;
    newState = data;

    if (newState?.score_progress) {
      newState.score_progress[`${moment().format("YYYY-MM-DD")}`] =
        newState?.readiness_scores?.readiness_score ?? 0;
      SAVE_SCORE_PROGRESS(newState?.score_progress);
    } else {
      const item = {
        [`${moment().format("YYYY-MM-DD")}`]:
          newState?.readiness_scores?.readiness_score ?? 0,
      };
      SAVE_SCORE_PROGRESS(item);
    }
  } else if (action.type == ACTION_EVENT.SET_NEW_PROFILE) {
    const data = action?.payload;
    newState = data;
    UPDATE_USER_PROFILE(data);
  } else if (action.type == ACTION_EVENT.SET_NOTIFICATION) {
    newState.quiz_of_the_day_reminder = action?.payload?.quiz ?? true;
    newState.study_plan_reminder = action?.payload?.study ?? true;
    UPDATE_NOTIFICATION_SETTING(
      newState.quiz_of_the_day_reminder,
      newState.study_plan_reminder
    );
  } else if (action.type == ACTION_EVENT?.SET_PROFILE_DETAILS) {
    // (newState.auth_first_name = action?.payload?.firstName ?? ""),
    //   (newState.auth_last_name = action?.payload?.lastName ?? "");
    UPDATE_PROFILE_DETAILS(newState.auth_first_name, newState.auth_last_name);
  } else if (action.type == ACTION_EVENT.SET_PROFILE_PICTURE) {
    newState.profile_pic = action?.payload?.profile_pic ?? "";
  } else if (action.type == ACTION_EVENT.SET_PROFILE_TEST_OPTIONS) {
    newState.time_per_question = action?.payload?.time_per_question ?? 90;
    newState.allow_go_back = action?.payload?.allow_go_back ?? true;
    UPDATE_USER_TEST_OPTIONS(
      newState.time_per_question,
      newState.allow_go_back
    );
  } else if (action.type == ACTION_EVENT.SET_PROFILE_FONT_OPTIONS) {
    newState.font_size = action?.payload?.font_size ?? 1;
    UPDATE_USER_FONTS_OPTIONS(newState.font_size);
  } else if (action.type == ACTION_EVENT.SET_TEST_HISTORY) {
    const history = newState?.practice_test_history
      ? [...newState.practice_test_history]
      : [];
    history.push(action?.payload);
    newState.practice_test_history = history;
    SAVE_TEST_HISTORY(newState.practice_test_history);
  } else if (action.type == ACTION_EVENT.DELETE_TEST_HISOTRY) {
    let history = _.cloneDeep(newState.practice_test_history);
    history = history.filter(
      (item) => JSON.stringify(item) != JSON.stringify(action.payload)
    );
    newState.practice_test_history = history;
    DELETE_TEST_HISTORY(action.payload);
  } else if (action.type == ACTION_EVENT.ADD_FLASHCARD_TO_BOOKMARK) {
    let bookmarks = _.cloneDeep(newState.flashcard_bookmarks);
    if (bookmarks) {
      bookmarks.push(action.payload);
    } else {
      bookmarks = [action.payload];
    }
    newState.flashcard_bookmarks = bookmarks;
    SAVE_FLASHCARD_BOOKMARK(bookmarks);
  } else if (action.type == ACTION_EVENT.REMOVE_FLASHCARD_FROM_BOOKMARK) {
    let bookmarks = _.cloneDeep(newState.flashcard_bookmarks);
    if (bookmarks) {
      bookmarks = bookmarks.filter((item) => item != action.payload);
    }
    newState.flashcard_bookmarks = bookmarks;
    SAVE_FLASHCARD_BOOKMARK(bookmarks);
  } else if (action.type == ACTION_EVENT.ADD_FLASHCARD_PROGRESS) {
    let progress = _.cloneDeep(newState.flashcards_progress);
    if (progress) {
      progress = progress.filter(
        (item) => item.flashcard_set_id != action.payload.flashcard_set_id
      );
      progress.push(action.payload);
    } else {
      progress = [action.payload];
    }
    newState.flashcards_progress = progress;
    SAVE_FLASHCARD_PROGRESS(progress);
  } else if (action.type == ACTION_EVENT.ADD_QUESTION_TO_BOOKMARK) {
    let bookmarks = _.cloneDeep(newState.question_bookmarks);
    if (bookmarks) {
      bookmarks.push(action.payload);
    } else {
      bookmarks = [action.payload];
    }
    newState.question_bookmarks = bookmarks;
    SAVE_QUESTION_BOOKMARK(bookmarks);
  } else if (action.type == ACTION_EVENT.REMOVE_QUESTION_FROM_BOOKMARK) {
    let bookmarks = _.cloneDeep(newState.question_bookmarks);
    if (bookmarks) {
      bookmarks = bookmarks.filter((item) => item != action.payload);
    }
    newState.question_bookmarks = bookmarks;
    SAVE_QUESTION_BOOKMARK(bookmarks);
  } else if (action.type == ACTION_EVENT.ADD_QUESTION_PROGRESS) {
    let progress = _.cloneDeep(newState.questions_progress);
    if (progress) {
      progress = progress.filter(
        (item) =>
          item.study_questions_set_id != action.payload.study_questions_set_id
      );
      progress.push(action.payload);
    } else {
      progress = [action.payload];
    }
    newState.questions_progress = progress;
    SAVE_QUESTION_PROGRESS(progress);
  } else if (action.type == ACTION_EVENT.ON_UPDATE_QUESTIONS_SCROE) {
    let scores = action.payload.scores;
    const questionsList = action.payload.questionsList;
    const APP_DOMAIN_LIST = action.payload.app_domains;

    const total_question = questionsList.length;
    const questions_answered = scores.filter(
      (i) => i.times_answered >= 1
    ).length;
    const questions_correct = scores.filter((i) => i.score >= 1).length;
    const total_accuracy_score = _.sumBy(scores, "accuracy_score");
    const accuracy_score_percentage = total_accuracy_score / questions_answered;
    const completeness_score_percentage = questions_answered / total_question;

    var topicProgress = [];
    for (let index in APP_DOMAIN_LIST) {
      const domain = APP_DOMAIN_LIST[index];
      const topic_total = questionsList?.filter(
        (e) => e.topic_id == domain.id
      ).length;
      const topic_score_list = scores.filter((i) => i.topic_id == domain.id);
      const topic_questions_answered = topic_score_list.filter(
        (i) => i.times_answered >= 1
      ).length;
      const topic_questions_correct = topic_score_list.filter(
        (i) => i.score >= 1
      ).length;
      const topic_total_accuracy_score = _.sumBy(
        topic_score_list,
        "accuracy_score"
      );
      const topic_accuracy_score_percentage =
        topic_total_accuracy_score / topic_questions_answered;
      const topic_completeness_score_percentage =
        topic_questions_answered / topic_total;
      const readiness_score =
        (topic_accuracy_score_percentage * 0.7 +
          topic_completeness_score_percentage * 0.3) *
        100;
      const topicObj = {
        domain_name: domain.domain_name,
        domain_id: domain.id,
        total_questions: topic_total,
        questions_answered: topic_questions_answered,
        questions_correct: topic_questions_correct,
        questions_incorrect: topic_questions_answered - topic_questions_correct,
        total_accuracy_score: topic_total_accuracy_score,
        accuracy_score_percentage: topic_accuracy_score_percentage,
        completeness_score_percentage: topic_completeness_score_percentage,
        readiness_score: isNaN(readiness_score) ? 0 : readiness_score,
      };

      topicProgress.push(topicObj);
    }

    const obj = {
      total_questions: total_question,
      questions_answered: questions_answered,
      questions_correct: questions_correct,
      questions_incorrect: questions_answered - questions_correct,
      total_accuracy_score: total_accuracy_score,
      accuracy_score_percentage: accuracy_score_percentage,
      completeness_score_percentage: completeness_score_percentage,
      readiness_score:
        (accuracy_score_percentage * 0.7 +
          completeness_score_percentage * 0.3) *
        100,
      topic_progress: topicProgress,
    };
    newState.readiness_scores = obj;

    if (newState?.score_progress) {
      newState.score_progress[`${moment().format("YYYY-MM-DD")}`] =
        newState?.readiness_scores?.readiness_score;
      SAVE_SCORE_PROGRESS(newState.score_progress);
    } else {
      const item = {
        [`${moment().format("YYYY-MM-DD")}`]:
          newState?.readiness_scores?.readiness_score,
      };
      SAVE_SCORE_PROGRESS(item);
    }

    SAVE_PROGRESS_DASHBOARD(obj);
  }

  return newState;
};

export const ProfileReducer = {
  initial,
  reducer,
};
