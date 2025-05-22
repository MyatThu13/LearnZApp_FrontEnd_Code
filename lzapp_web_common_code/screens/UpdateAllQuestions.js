import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

import { useNavigate } from "react-router-dom";
import { LAText, LAView } from "../components";
import { Rings } from "react-loader-spinner";
import { STRINGS } from "../constant";
import { GET_SCORE_QUESTIONS } from "../api/questions";

function UpdateAllQuestions(props) {
  const { profile, questionScrore, setAllQuestionData } =
    useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    startUpdating();
  }, []);

  async function startUpdating() {
    // const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
    // let url = CLOULD_FUNCTION_URL.replace("APP_NAME", APP_NAME);
    // url = url.replace("USER_ID", auth().currentUser.uid);

    try {
      //   const result = await fetch(url, { method: "GET" });
      //   const Json = await result.json();
      //   console.log(Json);
    } catch (error) {
      console.log(error);
    }

    // for (index in profile?.all_question_scores ?? []) {
    //     const questions = profile?.all_question_scores[index]
    //     await SAVE_QUESTION(questions)
    // }

    await getScoreQuestions();

    moveToHome();
  }

  async function getScoreQuestions() {
    const result = await GET_SCORE_QUESTIONS();
    setAllQuestionData(result?.data ?? []);
  }

  async function moveToHome() {
    const isAssesment =
      questionScrore?.all_question_scores?.length == 0 ? true : false;
    navigate("/updaterediness");
    navigate("/home", { state: { isAssesment: isAssesment } });
    // props.navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [
    //       {
    //         name: SCREENS.Tabbar.identifier,
    //         params: {
    //           isAssesment: isAssesment,
    //         },
    //       },
    //     ],
    //   })
    // );
  }

  //   const styles = StyleSheet.create({
  //     container: {
  //       flex: 1.0,
  //       justifyContent: "center",
  //       backgroundColor: theme.THEME_SCREEN_BACKGROUND_COLOR,
  //       alignItems: "center",
  //     },
  //     prepareLogo: {
  //       height: 46,
  //       width: 200,
  //       marginBottom: 40,
  //     },
  //   });

  return (
    <>
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
          title={STRINGS?.prepare_message}
        ></LAText>
      </LAView>
    </>
  );
}

export default UpdateAllQuestions;
