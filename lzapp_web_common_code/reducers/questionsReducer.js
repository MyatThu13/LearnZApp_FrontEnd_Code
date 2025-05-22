//CONSTANT
import { STRING } from "../constant";
import { ACTION_EVENT } from "../constant/event";

//PACKAGE
import _ from "lodash";

const initial = {
  all_questions_scrores: [],
};

const reducer = (state, action) => {
  let newState = _.cloneDeep(state);
  if (action.type == ACTION_EVENT.SET_ALL_QUESTION_SCORE) {
    newState.all_questions_scrores = action?.payload;
  }
  return newState;
};

export const QuestionReducer = {
  initial,
  reducer,
};
