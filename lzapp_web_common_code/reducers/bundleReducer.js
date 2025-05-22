//COMNON
import { ACTION_EVENT } from "../constant/event";

//API
import {
  UPDATE_BUNDLE_PROFILE_DETAILS,
  UPDATE_BUNDLE_USER_PROFILE,
} from "../api/firebase_user";
//PACKAGES
import _ from "lodash";

const initial = {
  auth_email: "",
  auth_first_name: "",
  auth_last_name: "",
  auth_login_provider: "",
  last_signin_time: "",
};

const reducer = (state, action) => {
  let newState = _.cloneDeep(state);
  if (action.type === ACTION_EVENT.SET_PROFILE) {
    const data = action?.payload;
    newState = data;
  } else if (action.type === ACTION_EVENT.SET_NEW_PROFILE) {
    const data = action?.payload;
    newState = data;
    UPDATE_BUNDLE_USER_PROFILE(data);
  } else if (action.type === ACTION_EVENT.SET_PROFILE_DETAILS) {
    newState.auth_first_name = action?.payload?.firstName ?? "";
    newState.auth_last_name = action?.payload?.lastName ?? "";
    UPDATE_BUNDLE_PROFILE_DETAILS(
      newState.auth_first_name,
      newState.auth_last_name
    );
  } else if (action.type === ACTION_EVENT.SET_PROFILE_PICTURE) {
    newState.profile_pic = action?.payload?.profile_pic ?? "";
  }

  return newState;
};

export const BundleReducer = {
  initial,
  reducer,
};
