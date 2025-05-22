import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

import { useNavigate } from "react-router-dom";
import { LAText, LAView } from "../components";
import { Rings } from "react-loader-spinner";
import { STRINGS } from "../constant";

function UpdateReadinessScore(props) {
  const { profile, addAllQuestionScore, questionScrore } =
    useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    startUpdating();
  }, []);

  function startUpdating() {
    (profile?.practice_test_history ?? []).forEach((practiceTest, index) => {
      var list = [];
      const question_array = practiceTest?.test_questions_meta_data ?? [];
      question_array.forEach((element) => {
        list.push({
          question_id: element?.question_id,
          topic_id: element?.topic_id,
          correct: element?.response === STRINGS?.correct_tag,
        });
      });

      //   addAllQuestionScore(list);
    });

    moveToHome();
  }

  async function moveToHome() {
    const isAssesment =
      questionScrore?.all_questions_scrores?.length == 0 ? true : false;
    // moveToUpdateScore();

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

export default UpdateReadinessScore;
