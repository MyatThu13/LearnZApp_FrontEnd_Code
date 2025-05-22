import React, { useReducer, createContext } from "react";

//REDUCER
import { PracticeReducer } from "../reducers";

//CONSTANT
import { ACTION_EVENT } from "../constant/event";

export const AppContext = createContext();

export const AppProvider = (props) => {
  const [history, dispatchHistory] = useReducer(
    PracticeReducer.reducer,
    PracticeReducer.initial
  );

  function initalizePracticeTest(data) {
    dispatchHistory({
      type: ACTION_EVENT.SET_PRACTICE_TEST_INITIAL_VALUE,
      payload: data,
    });
  }

  function onSubmitQuestion(index, item, correct) {
    dispatchHistory({
      type: ACTION_EVENT.ON_CHANGE_QUESTION,
      payload: { index: index, item: item, correct: correct },
    });
  }

  function onChangeTime(seconds) {
    dispatchHistory({
      type: ACTION_EVENT.ON_CHANGE_TIME,
      payload: { seconds: seconds },
    });
  }

  function resetPracticeTest() {
    dispatchHistory({ type: ACTION_EVENT.RESET_TEST });
  }

  return (
    <AppContext.Provider
      value={{
        history,
        initalizePracticeTest,
        onSubmitQuestion,
        onChangeTime,
        resetPracticeTest,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
