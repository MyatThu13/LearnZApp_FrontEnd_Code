//CONSTANT
import { ACTION_EVENT } from "../constant/event";
import { STRING } from "../constant";

//PACKAGES
import _ from "lodash";
import moment from "moment";

const initial = {
  correct: 0,
  date: "",
  incorrect: 0,
  score: 0,
  test_name: "",
  test_questions_meta_data: [],
  total: 0,
  total_time: 0,
  remaining_time: 0,
  time_taken: 0,
  unanswered: 0,
  is_new_app_test: true,
};

const reducer = (state, action) => {
  const newState = _.cloneDeep(state);
  if (action.type === ACTION_EVENT.SET_PRACTICE_TEST_INITIAL_VALUE) {
    newState.date = moment().format("MMM, DD YYYY");
    newState.test_name = action?.payload?.test_name ?? "";
    newState.test_questions_meta_data =
      action?.payload?.test_questions_meta_data ?? [];
    newState.total = action?.payload?.total ?? 0;
    newState.total_time = action?.payload?.total_time ?? 0;
    newState.remaining_time = action?.payload?.remaining_time ?? 0;
    newState.time_taken = action?.payload?.time_taken ?? 0;
    newState.unanswered = (
      action?.payload?.test_questions_meta_data ?? []
    ).length;
  } else if (action.type === ACTION_EVENT.ON_CHANGE_QUESTION) {
    const index = action?.payload?.index;
    const item = action?.payload?.item;
    newState.test_questions_meta_data.splice(index, 1, item);
    newState.correct = newState.test_questions_meta_data.filter(
      (obj) => obj.response == STRING.correct_tag
    ).length;
    newState.incorrect = newState.test_questions_meta_data.filter(
      (obj) => obj.response == STRING.incorrect_tag
    ).length;
    newState.unanswered =
      newState.total - (newState.correct + newState.incorrect);
    newState.score = parseInt((newState.correct * 100) / newState.total);
  } else if (action.type === ACTION_EVENT.ON_CHANGE_TIME) {
    newState.remaining_time = newState.remaining_time - 1;
    newState.time_taken = newState.total_time - newState.remaining_time;
  } else if (action.type === ACTION_EVENT.RESET_TEST) {
    return initial;
  }

  return newState;
};

export const PracticeReducer = {
  initial,
  reducer,
};
