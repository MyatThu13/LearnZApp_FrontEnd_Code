//CONSTANT
import { ACTION_EVENT } from "../constant/event";
import { STRING } from "../constant";

// API
import { UPDATE_COMMUNITY_DATA } from "../api/community";

//PACKAGES
import _ from "lodash";

const initial = {
  questions_version: 1,
  total_time_per_question: 90,
  is_forcefully_new_version: false,
  android_app_verions: null,
  android_build_number: null,
  ios_app_version: null,
  ios_build_number: null,
};

const reducer = (state, action) => {
  let newState = _.cloneDeep(state);
  if (action.type == ACTION_EVENT.SET_COMMUNITY_DATA) {
    newState.questions_version = action?.payload.questions_version;
    newState.total_time_per_question = action?.payload.total_time_per_question;
    newState.android_app_verions = action?.payload?.android_app_verions;
    newState.android_build_number = action?.payload?.android_build_number;
    newState.ios_app_version = action?.payload?.ios_app_version;
    newState.ios_build_number = action?.payload?.ios_build_number;
    newState.is_forcefully_new_version =
      action?.payload?.is_forcefully_new_version;
  } else if (action.type === ACTION_EVENT.ON_UPDATE_COMMUNITY_DATA) {
    UPDATE_COMMUNITY_DATA(action?.payload);
  } else if (action.type === ACTION_EVENT.ON_UPDATE_ALL_COMMUNITY_DATA) {
    for (let index in action.payload.history) {
      const communityData = action.payload.history[index];
      if (communityData.selected != STRING.unanswered_tag) {
        UPDATE_COMMUNITY_DATA(communityData);
      }
    }
  }

  return newState;
};

export const CommunityReducer = {
  initial,
  reducer,
};
