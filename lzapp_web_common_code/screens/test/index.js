import React, { useContext, useEffect, useRef, useState } from "react";
import {
  LAText,
  LAView,
  LAWarningPopup,
} from "../../components";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { useLocation, useNavigate } from "react-router-dom";
import HTMLContent from "../../components/HTMLContent";
import ExplanationComponent from "../../components/ExplanationComponent";
import AnswerMessage from "../../components/AnswerMessage";
import { STRING, STRINGS } from "../../constant";
import { AuthContext } from "../../context/AuthProvider";
import { BundleContext } from "../../context/BundleProvider";
import { AppContext } from "../../context/AppProvider";
import { GET_APP_DOMAIN_LIST } from "../../../app_constant";
import { toHHMMSS } from "../../constant/strings";
import { ThemeContext } from "../../context/ThemeProvider";
import BackArrowIcon from "../../components/BackArrowIcon";
import TabFooter from "../../components/TabFooter";
import { MixpanelContext } from "../../context/MixpanelProvider";
import QuestionOptions from "../../components/question/QuestionOptions";
import {
  GET_CUSTOM_TEST_DETAILS,
  GET_PRACTICE_TEST_DETAILS,
  GET_QUESTION_FROM_ID,
  GET_RETAKE_TEST_DETAILS,
} from "../../api/test";
import InfoDialog from "../../components/InfoDialog";

const Test = (props) => {
  const {
    profile,
    questionsList,
    community,
    setTestHistory,
    addQuestionScore,
    addAllQuestionScore,
    questionScrore,
  } = useContext(AuthContext);
  const {
    history,
    initalizePracticeTest,
    onSubmitQuestion,
    onChangeTime,
    resetPracticeTest,
  } = useContext(AppContext);

  const { theme, currentTheme } = useContext(ThemeContext);

  const { selectedCertificate } = useContext(BundleContext);
  const { trackReadinessScore, trackPracticeExit, trackPracticeCompleted } =
    useContext(MixpanelContext);
  const { state } = useLocation();

  const [isLoading, setLoading] = useState(false);
  const [quickSetState, setQuickSetState] = useState({
    selectedOpion: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [isTimeup, setTimeup] = useState(false);
  //   const [timerColor, setTimerColor] = useState(theme.TIMER_BACKGROUND)
  const [isTestExitPopup, setTestExitPopup] = useState(false);
  const [isTestEndPopup, setTestEndPopup] = useState(false);
  const [historyTimeup, setHistoryTimeup] = useState(null);
  const [testStarted, setTestStarted] = useState(true);
  /* const [lastReadinessScore, setLastReadinessScore] = useState(profile?.readiness_scores?.readiness_score)
  console.log("lastReadinessScore", lastReadinessScore) */
  const lastReadinessScore = profile?.readiness_scores?.readiness_score;
  const [isSubmitAnswer, setSubmitAnswer] = useState({});

  const numberOfQuestion = state?.numberOfQuestion;
  const isShowAnswer =
    state?.isShowAnswer || state?.is_show_answer ? true : false;
  const practiceTest = state ?? null;
  const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  const navigation = useNavigate();
  const historyRef = useRef(null);
  historyRef.current = history;

  const timeRef = useRef(null);
  timeRef.current = history?.remaining_time;

  const lastIndexRef = useRef(null);
  lastIndexRef.current = lastIndex;

  async function onSaveTestHistory(isTimeup) {
    let historyData = { ...historyRef.current };
    console.log("historyData", historyData);

    if (practiceTest?.is_custom_test && practiceTest?.total_time > 0) {
      const totalItems = historyData?.test_questions_meta_data ?? [];
      const attemptQuestions = totalItems.splice(0, lastIndexRef.current + 1);
      historyData.test_questions_meta_data = attemptQuestions;
      console.log("attemptQuestions", attemptQuestions);

      const correct =
        attemptQuestions?.filter((item) => item.response == STRING.correct_tag)
          ?.length ?? 0;
      const incorrect =
        attemptQuestions?.filter(
          (item) => item.response == STRING.incorrect_tag
        )?.length ?? 0;
      const unanswered =
        attemptQuestions?.filter(
          (item) => item.response == STRING.unanswered_tag
        )?.length ?? 0;

      historyData.correct = correct;
      historyData.incorrect = incorrect;
      historyData.unanswered = unanswered;
      historyData.total = attemptQuestions.length;
      historyData.score = parseInt((correct * 100) / attemptQuestions.length);
    }
    setTestHistory(historyData);
    setHistoryTimeup(historyData);

    if (!isShowAnswer) {
      var list = [];
      const question_array = historyData?.test_questions_meta_data ?? [];
      question_array.forEach((element) => {
        list.push({
          question_id: element?.question_id,
          topic_id: element?.topic_id,
          correct: element?.response == STRING.correct_tag,
          selected: element?.response,
        });
      });
      addAllQuestionScore(list);
    }

    const total = historyData?.test_questions_meta_data?.length ?? 0;
    const unanswered =
      historyData?.test_questions_meta_data?.filter(
        (item) => item.response == STRING.unanswered_tag
      )?.length ?? 0;
    const answered = total - unanswered;

    if (isTimeup) {
      trackPracticeCompleted(
        practiceTest?.test_name ?? "",
        total,
        answered,
        profile?.readiness_scores?.readiness_score ?? 0
      );
      setTimeup(true);
    } else {
      trackPracticeCompleted(
        practiceTest?.test_name ?? "",
        total,
        answered,
        profile?.readiness_scores?.readiness_score ?? 0
      );

      //   props.navigation.navigate(SCREENS.TestReview.identifier, {
      //     testItem: historyData,
      //     canGoBack: false,
      //   });
      //navigation("/testReview", { state: historyData, canGoBackKey: false, lastReadinessScore: lastReadinessScore });
      navigation("/testReview", { state: { historyData, canGoBackKey: false, lastReadinessScore } });

      resetPracticeTest();
    }
  }

  const backAction = () => {
    onBack();
    return true;
  };

  function onBack() {
    setTestExitPopup(true);
  }

  function onExit() {
    const total = history?.test_questions_meta_data?.length ?? 0;
    const unanswered =
      history?.test_questions_meta_data?.filter(
        (item) => item.response == STRING.unanswered_tag
      )?.length ?? 0;
    const answered = total - unanswered;

    trackPracticeExit(practiceTest?.test_name ?? "", total, answered);

    onUpdateScore();
    resetPracticeTest();

    if (practiceTest?.is_retake_test) {
      // props.navigation.dispatch(
      //     CommonActions.reset({
      //         index: 0,
      //         routes: [
      //             {
      //                 name: SCREENS.Tabbar.identifier,
      //                 params: {
      //                     isShowReview: true
      //                 }
      //             }
      //         ],
      //     })
      // );
      navigation("/home", { state: { isShowReview: true } });
    } else {
      // props.navigation.goBack()
      navigation(-1);
    }
  }

  function onUpdateScore() {
    console.log("onUpdateScore" + selectedIndex?.selected);
    if (
      selectedIndex &&
      selectedIndex.selected != "X" &&
      isShowAnswer &&
      selectedIndex.is_from_older == false
    ) {
      addQuestionScore(
        currentItem?.question.id,
        currentItem?.question.topic_id,
        currentItem?.question.correct_answer == selectedIndex.selected
      );
      trackReadinessScore(profile?.readiness_scores?.readiness_score ?? 0);
    }
  }

  function getCurrentQuestion() {
    // const data = GET_QUESTION_FROM_ID(questionsList, id);
    if (
      history?.test_questions_meta_data?.length > 0 ||
      !isNaN(currentIndex) ||
      history?.test_questions_meta_data?.length > currentIndex
    ) {
      const id = history?.test_questions_meta_data[currentIndex]?.question_id;
      return GET_QUESTION_FROM_ID(questionsList, id);
    } else {
      return null;
    }
  }

  function getTopicId() {
    const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
    const array = APP_DOMAIN_LIST.find(
      (item) => item.id == currentItem?.question?.topic_id
    );
    return array?.domain_name ?? "";
  }

  function onPrevious() {
    onUpdateScore();
    setSelectedIndex(null);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    setCurrentIndex((state) => {
      return state == 0 ? 0 : state - 1;
    });
  }

  function onNext() {
    onUpdateScore();
    setSelectedIndex(null);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    if (currentIndex + 1 >= lastIndexRef.current) {
      setLastIndex(currentIndex + 1);
    }

    setCurrentIndex((state) => {
      return state == history?.test_questions_meta_data.length - 1
        ? 0
        : state + 1;
    });
  }
  function getCurrentQuestion() {
    // const data = GET_QUESTION_FROM_ID(questionsList, id);

    if (
      history?.test_questions_meta_data?.length > 0 ||
      !isNaN(currentIndex) ||
      history?.test_questions_meta_data?.length > currentIndex
    ) {
      const id = history?.test_questions_meta_data[currentIndex]?.question_id;
      return GET_QUESTION_FROM_ID(questionsList, id);
    } else {
      return null;
    }
  }

  function onEndTest() {
    onUpdateScore();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        setTestEndPopup(true);
      }, 500);
    }, 1000);
  }

  const currentItem = getCurrentQuestion();
  const time = toHHMMSS(history.remaining_time);
  const topic = getTopicId();

  useEffect(() => {
    if (history?.test_questions_meta_data?.length > 0) {
      setSelectedIndex({
        selected:
          history?.test_questions_meta_data[currentIndex]?.selected_choice,
        is_from_older: true,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    let timer = null;

    if (!isShowAnswer && history.total_time) {
      timer = setInterval(() => {
        if (timeRef.current <= 0) {
          clearInterval(timer);
          /* setTimeout(() => {
            onSaveTestHistory(true);
          }, 1000); */
            onUpdateScore();
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setTimeout(() => {
                setTimeup(true);
              }, 500);
            }, 1000);
          
        } else {
          onChangeTime();
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isShowAnswer, history.total_time]);

  useEffect(() => {
    fetchQuestionList();
  }, []);

  const setSelectedAnswer = (questionId, selectedOption) => {
    // setQuickSetState((prev) => ({
    //   ...prev,
    //   selectedOpion: selectedOption,
    // }));
  };

  function fetchQuestionList() {
    const questionTime = profile?.time_per_question
      ? profile?.time_per_question
      : community?.total_time_per_question ?? 90;

    if (practiceTest?.is_custom_test) {
      const result = GET_CUSTOM_TEST_DETAILS(
        questionsList,
        questionTime,
        practiceTest,
        profile,
        questionScrore
      );

      initalizePracticeTest(result);
    } else if (practiceTest?.is_retake_test) {
      const result = GET_RETAKE_TEST_DETAILS(practiceTest);
      initalizePracticeTest(result);
    } else {
      const result = GET_PRACTICE_TEST_DETAILS(
        questionsList,
        questionTime,
        practiceTest,
        numberOfQuestion
      );
      initalizePracticeTest(result);
    }
  }

  return (
    <>
      <LAView className="relative w-full" type="">
        <div className="page-heading mx-4 my-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                onClick={
                  () =>
                    // onBack()
                    setTestExitPopup(true)
                  // navigation(-1)
                }
                className="h-10 w-10 flex items-center justify-center border-2 rounded-lg px-2 py-2"
              >
                <BackArrowIcon
                  color={currentTheme === "light" ? "#101010" : "#fff"}
                />
              </button>

              <LAText
                className="flex line-clamp-1 truncate "
                size="medium"
                font="600"
                color={"black"}
                title={`${history?.test_name ?? state?.test_name} (${
                  history?.test_questions_meta_data.length
                })`}
              />
            </div>

            {time != "" && !isShowAnswer && (
              <div
                className={`flex items-center gap-2 rounded-[10px] px-2 py-2 bg-[${theme.TIMER_BACKGROUND}]`}
                style={{
                  background: `${theme.TIMER_BACKGROUND}`,
                  // color: `${theme?.THEME_TEXT_BLACK}`,
                }}
              >
                <img
                  className="w-6 h-6 "
                  alt="timer_icon"
                  src={IMAGES.ic_timer}
                />
                <p style={{ color: theme.THEME_DARK }}>{time}</p>
              </div>
            )}
          </div>

          <div className="my-2 flex items-center justify-between border-b border-dashed pb-2">
            <h4
              className="text-base font-semibold "
              style={{ color: `${theme?.THEME_LIGHT}` }}
            >
              Questions {`${currentIndex + 1}`}
              <span className="text-sm font-normal dark:text-white text-black">
                / {history?.test_questions_meta_data.length}
              </span>
            </h4>
          </div>

          <div className="p-4">
            <HTMLContent
              htmlContent={currentItem?.question?.question}
              style={{
                marginBottom: "25px",
                color: theme?.THEME_TEXT_BLACK_LIGHT,
              }}
            />

            <LAView className="grid gap-2 w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
              {currentItem?.choices?.map((options, index) => {
                const isSelected = selectedIndex
                  ? selectedIndex.selected == OPTIONS[index]
                  : false;

                return (
                  <>
                    <QuestionOptions
                      key={index + JSON.stringify(options)}
                      index={index}
                      item={options}
                      isShowAnswer={isShowAnswer}
                      correct={currentItem.question.correct_answer}
                      selected={
                        history?.test_questions_meta_data[currentIndex]
                          ?.selected_choice
                      }
                      isSubmit={(isSubmitAnswer?.[currentIndex] ?? false)}
                      onPress={() => {
                        const selected = OPTIONS[index];
                        const correct = currentItem?.question?.correct_answer;
                        const item =
                          history?.test_questions_meta_data[currentIndex];
                        if (Array.isArray(correct)) {
                          const previousSelectedOptions = history?.test_questions_meta_data?.[currentIndex]?.selected_choice == 'X' ? [] : (history?.test_questions_meta_data?.[currentIndex]?.selected_choice ?? [])
                          //const previousSelectedOptions = history?.test_questions_meta_data?.[currentIndex] ?.selected_choice ?? [];
                          if (previousSelectedOptions.includes(selected)) {
                            let selectedOptions = [...previousSelectedOptions];
                            selectedOptions = selectedOptions.filter(
                              (e) => e != selected
                            );
                            item.selected_choice = selectedOptions;
                          } else {
                            const selectedOptions = [
                              ...previousSelectedOptions,
                            ];
                            selectedOptions.push(selected);
                            item.selected_choice = selectedOptions;
                          }
                          let isCorrect = true;
                          /* correct.forEach((element) => {
                            if (!item?.selected_choice?.includes(element)) {
                              isCorrect = false;
                            }
                          }); */
                          if (correct?.length == item?.selected_choice?.length)  {
                            correct.forEach(element => {
                                if (!item?.selected_choice?.includes(element)) {
                                    isCorrect = false
                                }
                            });
                        }
                        else {
                            isCorrect = false
                        }

                          if (selected.length > 0) {
                            item.response = isCorrect
                              ? STRING.correct_tag
                              : STRING.incorrect_tag;
                          } else {
                            item.response = STRING.unanswered_tag;
                          }
                          onSubmitQuestion(currentIndex, item);
                          //console.log("selected", item.selected_choice);
                          setSelectedIndex({ selected: item.selected_choice, is_from_older: false });
                        } else {
                          item.selected_choice = selected ?? "X";
                          if (selected != "X" && selected != null) {
                            item.response =
                              correct == selected
                                ? STRING.correct_tag
                                : STRING.incorrect_tag;
                          } else {
                            item.response = STRING.unanswered_tag;
                          }
                          if (!isShowAnswer) {
                            onSubmitQuestion(currentIndex, item);
                            setSelectedIndex({
                              selected: selected,
                              is_from_older: false,
                            });
                          } else
                          /* if (
                            (!selectedIndex || selectedIndex.selected == "X") && isShowAnswer == true
                          )  */ {
                            onSubmitQuestion(currentIndex, item);
                            setSelectedIndex({ selected: selected, is_from_older: false });

                            const submitted = { ...isSubmitAnswer }
                            submitted[currentIndex] = true
                            setSubmitAnswer(submitted)

                          }
                        }
                      }}
                    />
                  </>
                );
              })}
            </LAView>
            {isShowAnswer && (isSubmitAnswer?.[currentIndex] ?? false) == false && Array.isArray(currentItem?.question?.correct_answer) && selectedIndex && selectedIndex?.selected != '' && selectedIndex?.selected != 'X' && selectedIndex?.selected?.length > 0 &&
              <div className="flex justify-center items-center">
                <div className="w-full md:w-auto p-4">
                  <button
                      className="my-4 py-2 px-6 rounded-full bg-lz-blue text-white text-sm font-semibold text-center"
                      onClick={() => {
                          const submitted = { ...isSubmitAnswer };
                          submitted[currentIndex] = true;
                          setSubmitAnswer(submitted);
                      }}
                  >
                      Submit Answer
                  </button>
              </div>
            </div>
            }
            {isShowAnswer && (isSubmitAnswer?.[currentIndex] ?? false) && selectedIndex && selectedIndex.selected != 'X' &&
            (
              <div className="pt-6">
                <AnswerMessage
                    correct_answer={currentItem?.question?.correct_answer}
                    selected_answer={selectedIndex.selected}
                />
                <ExplanationComponent
                  explanation={currentItem.question?.explanation ?? ""}
                  topic={topic}
                  sub_domain={
                    currentItem?.question?.sub_domain
                      ? currentItem?.question?.sub_domain
                      : ""
                  }
                />
                {/* <div>
                  <h3
                    className="font-semibold"
                    style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
                  >
                    {STRINGS.explanation} :
                  </h3>
                  <span style={{ color: `${theme?.THEME_TEXT_BLACK}` }}>
                    {currentItem.question?.explanation ?? ""}
                  </span>
                </div>
                <div className="w-full  text-center pt-4">
                  <div
                    className=" w-1/2 mx-auto py-4 px-6 rounded"
                    style={{
                      background: `${theme.THEME_SCREEN_BACKGROUND_COLOR}`,
                      color: `${theme?.THEME_TEXT_GRAY}`,
                    }}
                  >
                    <h4>{topic}</h4>
                    {(currentItem?.question?.sub_domain ?? "") !== "" && (
                      <span>
                        {currentItem?.question?.sub_domain
                          ? currentItem?.question?.sub_domain
                          : ""}
                      </span>
                    )}
                  </div>
                </div> */}
              </div>
              // <div className="pt-6">
              //   <div>
              //     <h3 className="font-semibold">{STRINGS.explanation} :</h3>
              //     <span>{currentItem.question?.explanation ?? ""}</span>
              //   </div>
              //   <div className="w-full  text-center pt-4">
              //     <div className="bg-gray-50 w-1/2 mx-auto py-4 px-6 rounded" >
              //       <h4>{topic}</h4>
              //       {(currentItem?.question?.sub_domain ?? "") !== "" && (
              //         <span>
              //           {currentItem?.question?.sub_domain
              //             ? currentItem?.question?.sub_domain
              //             : ""}
              //         </span>
              //       )}
              //     </div>
              //   </div>
              // </div>
            )}
          </div>
        </div>

        <TabFooter
          activeIndex={currentIndex}
          theme={theme}
          questionArrayaLength={history?.test_questions_meta_data?.length}
          onNext={onNext}
          onPrevious={onPrevious}
          isEndTest={true}
          onEndTest={onEndTest}
        />

        {/* <LAView
          flex="row"
          background="secondary"
          className="flex mx-4 mb-20 sm:mb-20 md:mb-20 lg:mb-4 pb-2 lg:pl-[150px] pl-[0px] lg:pb-3  fixed w-full bottom-0 left-0 right-0 mt-3 py-2 px-4 sm:px-6 py-4 items-center justify-between"
        >
          <LAView
            onClick={() => onPrevious()}
            className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 lg:px-10 py-4 ${
              currentIndex !== 0 ? "bg-black" : "bg-[#f2f2f2]"
            } rounded-full`}
          >
            <LAText
              className=""
              size="small"
              font="400"
              color={"gray"}
              title={"❮"}
            />
            <LAView className="mx-1" />
            <LAText
              className=""
              size="small"
              font="400"
              color={"gray"}
              title={STRINGS.previous}
            />
          </LAView>

          <button onClick={() => onEndTest()}>
            {" "}
            <div className="flex items-center gap-2">
              <img className="w-4 g-4" src={IMAGES?.ic_cancel} />{" "}
              <span className="text-sm font-medium">End Test</span>
            </div>
          </button>
          <LAView
            onClick={() => onNext()}
            className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 lg:px-10 py-4 ${
              selectedIndex?.selected || currentIndex !== 0
                ? "bg-black"
                : "bg-[#f2f2f2]"
            } rounded-full`}
          >
            <LAText
              className=""
              size="small"
              font="400"
              color={"gray"}
              title={"Next"}
            />
            <LAView className="mx-1" />
            <LAText
              className="bg-red"
              size="small"
              font="400"
              color={"gray"}
              title={"❯"}
            />
          </LAView>
        </LAView> */}
      </LAView>

      {/*
      {isTestEndPopup && (
         <LAWarningPopup
          onCancle={() => {
            setTestEndPopup(false);
          }}
          onPress={(e, index) => {
            
            if (index == 1) {
              setTestEndPopup(false);
              onSaveTestHistory(false);
            } else {
              setTestEndPopup(false);
            }
          }}
          options={[STRINGS.no, STRINGS.yes]}
          title={STRINGS.test_end_warning}
          iconHide={true}
          // desc={STRINGS.flashcard_message}
        /> */}
        {isTestEndPopup && (
        <InfoDialog
          isOpen={isTestEndPopup}
          title={STRINGS.test_end_warning}
          description="You still have time left to complete the test. If you choose to end it now, your score will be calculated and you’ll be redirected to the test performance page. <br>Click ‘Cancel’ to continue the test or ‘Yes’ to end it."
          actions={[
            {
              label: "Cancel",
              className: 'bg-gray-500 dark:bg-gray-700 text-white hover:bg-gray-600 dark:hover:bg-gray-800',
              onClick: () => {
                setTestEndPopup(false);
              },
            },
            {
              label: "Yes",
              className: 'bg-lz-blue text-white hover:bg-lz-orange',
              onClick: () => {
                setTestEndPopup(false);
                onSaveTestHistory(false);
              },
            },
          ]}
        />
      )}

      {isTestExitPopup && (
        <InfoDialog
          isOpen={isTestExitPopup}
          title={STRINGS.test_exit_warning}
          description="Are you sure you want to exit the test? Your progress will not be saved."
          actions={[
            {
              label: "Cancel",
              className: 'bg-gray-500 dark:bg-gray-700 text-white hover:bg-gray-600 dark:hover:bg-gray-800',
              onClick: () => {
                setTestExitPopup(false);
              },
            },
            {
              label: "Yes",
              className: 'bg-lz-blue text-white hover:bg-lz-orange',
              onClick: () => {
                navigation(-1, { state: { isFromBack: true } });
                setTestExitPopup(false);
                //onExit();
              },
            },
          ]}
        />

       
      )}
      {isTimeup && (
        <InfoDialog
          isOpen={isTimeup}
          title={STRINGS.time_up_message}
          description=" "
          actions={[
            {
              label: "Show Test Performance",
              className: 'bg-lz-blue text-white hover:bg-lz-orange',
              onClick: () => {
                setTimeup(false);
                onSaveTestHistory(false);
              },
            },
          ]}
        />

        
      )}
    </>
  );
};

export default Test;
