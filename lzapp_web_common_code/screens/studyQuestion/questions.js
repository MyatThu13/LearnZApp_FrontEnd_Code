import React, { useContext, useState, useEffect } from "react";
import { LAButton, LAText, LAView } from "../../components";
import HTMLContent from "../../components/HTMLContent";
import ExplanationComponent from "../../components/ExplanationComponent";
import AnswerMessage from "../../components/AnswerMessage";
import { useLocation, useNavigate } from "react-router-dom";
import { STRINGS } from "../../constant";

// assets

// import { GET_QUESTION_FROM_ID } from "../../../content/index";
import { AuthContext } from "../../context/AuthProvider";
// lodash
import _ from "lodash";
//
import { GET_COMMUNITY_SINGLE_QUESTION_DETAILS } from "../../api/community";
import { GET_APP_DOMAIN_LIST, STRING } from "../../../app_constant";
import { BundleContext } from "../../context/BundleProvider";
// import CommunityPopup from "./CommunityPopup";
import { ThemeContext } from "../../context/ThemeProvider";
import BackArrowIcon from "../../components/BackArrowIcon";
import BookmarkIcons from "../../components/BookmarkIcons";
import TabFooter from "../../components/TabFooter";
import { MixpanelContext } from "../../context/MixpanelProvider";
import CommunityPopup from "../quickSet/CommunityPopup";
import QuestionOptions from "../../components/question/QuestionOptions";
import { GET_QUESTION_FROM_ID } from "../../api/test";

const Questions = () => {
  const { state } = useLocation();
  const set_id = state?.set_id ?? "";
  const lastIndex = state?.lastIndex || 0;
  const questionSet = state?.questions || [];
  const title = state?.title ?? STRINGS.study_questions_title;
  const isShowAnswer = true;
  const [quickSetState, setQuickSetState] = useState({
    selectedOpion: null,
  });
  const navigation = useNavigate();
  const {
    profile,
    questionsList,
    addQuestionScore,
    addQuestionProgress,
    isVisibleCommunity,
    addQuestionToBookmark,
    removeQuestionFromBookmark,
  } = useContext(AuthContext);
  const { theme, currentTheme } = useContext(ThemeContext);
  const { selectedCertificate } = useContext(BundleContext);
  const { trackReadinessScore } = useContext(MixpanelContext);
  const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [isLoadingCommunityData, setLoadingCommunityData] = useState(false);
  const [questions, setQuestions] = useState(questionSet);

  const [currentIndex, setCurrentIndex] = useState(lastIndex);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSubmitAnswer, setSubmitAnswer] = useState(false);
  const [communityQuestion, setCommunityQuestion] = useState(null);
  const [isCommunityPopup, setCommunityPopup] = useState(false);
  // useEffect(() => {
  //   if (questionSet) {
  //     let shuffleQuestionList = _.shuffle(questionsList).slice(0, 10);
  //     setQuestions(_.shuffle(questionsList).slice(0, 10));
  //   }
  // }, [questionsList]);

  useEffect(() => {
    setTimeout(() => {
      if (questions.length > lastIndex) {
        setCurrentIndex(lastIndex);
      }
    }, 300);
  }, []);

  const setSelectedAnswer = (questionId, selectedOption) => {
    setQuickSetState((prev) => ({
      ...prev,
      selectedOpion: selectedOption,
    }));
  };

  useEffect(() => {
    const question = questions[currentIndex];
    if (questions?.length > currentIndex && set_id) {
      addQuestionProgress(set_id, question?.id);
    }

    const index = savedAnswers.findIndex((e) => e.question_id == question?.id);
    if (index >= 0) {
      setSelectedIndex({
        selected: savedAnswers[index].selected,
        is_from_older: true,
      });
    }

    if (isVisibleCommunity && question) {
      setCommunityQuestion(null);
      getCommunityQuestion(question?.id);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (selectedIndex) {
      if (selectedIndex.is_from_older == false) {
        if (!Array.isArray(currentItem?.question?.correct_answer)) {
          onUpdateScore();
        }
      }
    }
  }, [selectedIndex]);

  async function getCommunityQuestion(id) {
    try {
      setLoadingCommunityData(true);
      const result = await GET_COMMUNITY_SINGLE_QUESTION_DETAILS(id);
      setLoadingCommunityData(false);
      if (result.data) {
        setCommunityQuestion(result.data);
      } else {
        setCommunityQuestion(null);
      }
    } catch (error) {
      setLoading(false);
      setCommunityQuestion(null);
    }
  }

  function onUpdateScore() {
    if (Array.isArray(currentItem?.question.correct_answer)) {
      if (selectedIndex && selectedIndex?.selected?.length > 0) {
        //console.log("onUpdateScore");
        trackReadinessScore(profile?.readiness_scores?.readiness_score ?? "");

        const answers = currentItem?.question.correct_answer;
        const selected = selectedIndex?.selected;

        let isCorrect = true;
        answers.forEach((element) => {
          if (!selected.includes(element)) {
            isCorrect = false;
          }
        });

        addQuestionScore(
          currentItem?.question.id,
          currentItem?.question.topic_id,
          isCorrect
        );
      }
    } else {
      if (selectedIndex && selectedIndex.selected != "X") {
        trackReadinessScore(profile?.readiness_scores?.readiness_score ?? "");
        //UPDATE USER SCORE
        addQuestionScore(
          currentItem?.question.id,
          currentItem?.question.topic_id,
          currentItem?.question.correct_answer == selectedIndex.selected
        );
      }
    }
  }

  function getCurrentQuestion() {
    if (questions.length > currentIndex) {
      return GET_QUESTION_FROM_ID(questionsList, questions[currentIndex]?.id);
    }

    return null;
  }

  function getTopicId() {
    if (questions.length > currentIndex) {
      const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
      const array = APP_DOMAIN_LIST.find(
        (item) => item?.id == questions[currentIndex]?.topic_id
      );
      return array?.domain_name ?? "";
    }

    return "";
  }

  function onPrevious() {
    trackReadinessScore(profile?.readiness_scores?.readiness_score ?? "");
    setSelectedIndex(null);
    setSubmitAnswer(false);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    setCurrentIndex((state) => {
      return state == 0 ? 0 : state - 1;
    });
  }

  function onNext() {
    trackReadinessScore(profile?.readiness_scores?.readiness_score ?? "");
    setSelectedIndex(null);
    setSubmitAnswer(false);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    setCurrentIndex((state) => {
      return state == questions.length - 1 ? 0 : state + 1;
    });
  }

  function onBookmark() {
    if (questions.length > currentIndex) {
      const question = questions[currentIndex];
      if (isBookmark) {
        // trackQuestionBookmark(-1)
        removeQuestionFromBookmark(question?.id);
      } else {
        // trackQuestionBookmark(1)
        addQuestionToBookmark(question?.id);
      }
    }
  }

  function checkBookmark() {
    if (questions.length > currentIndex) {
      const question = questions[currentIndex];
      return profile?.question_bookmarks?.includes(question?.id) ?? false;
    }

    return false;
  }

  function getCommunityQuestionPercentage() {
    if (communityQuestion && true) {
      const percentage =
        (communityQuestion?.times_answered_correct /
          communityQuestion?.times_answered) *
        100;
      if (isNaN(percentage) || !isFinite(percentage)) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRINGS.community_popup_desc_less_50,
        };
      } else if (percentage < 50) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRINGS.community_popup_desc_less_50,
        };
      } else if (percentage < 80) {
        return {
          color: theme.COLOR_YELLOW,
          percentage: 0,
          message: STRINGS.community_popup_desc_less_80,
        };
      } else {
        return {
          color: theme.COLOR_GREEN,
          percentage: 0,
          message: STRINGS.community_popup_desc_less_100,
        };
      }
    }

    return {
      color: theme.COLOR_RED,
      percentage: 0,
      message: STRINGS.community_popup_desc_less_50,
    };
  }
  const isBookmark = checkBookmark();
  const currentItem = getCurrentQuestion();
  const topic = getTopicId();

  const communitySettings = getCommunityQuestionPercentage();

  return (
    <LAView className="relative w-full" type="">
      <div className="page-heading mx-4 my-50">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigation(-1)}
            className="h-10 w-10 flex items-center justify-center border-2 rounded-lg"
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
            title={title}
          />
        </div>

        {questions?.length > 0 && (
          <div className="my-2 mx-12 flex items-center justify-between border-b border-dashed pb-3">
            <h4
              style={{ color: theme?.THEME_LIGHT }}
              className={`text-lg font-semibold text-[${theme?.THEME_LIGHT}] `}
            >
              {`${STRINGS.question} ${currentIndex + 1}`}
              <span
                style={{ color: theme?.THEME_TEXT_BLACK }}
                className="text-base font-normal "
              >
                &nbsp;/ {questions?.length}
              </span>
            </h4>

            <div className="flex gap-4">
              {selectedIndex?.selected && (
                <>
                  <div
                    onClick={() => setCommunityPopup(true)}
                    className="cursor-pointer"
                  >
                    <svg
                      stroke="currentColor"
                      fill={`${communitySettings?.color}`}
                      strokeWidth="0"
                      viewBox="0 0 640 512"
                      height="24px"
                      width="24px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z"></path>
                    </svg>
                  </div>
                </>
              )}

              <div onClick={() => onBookmark()}>
                <BookmarkIcons
                  isBookmark={isBookmark}
                  currentTheme={currentTheme}
                />
              </div>
            </div>
          </div>
        )}
        {currentItem && questions?.length > 0 ? (
          <div className="p-4">
            <HTMLContent
              index={currentItem?.question?.id}
              htmlContent={currentItem?.question?.question}
              //className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg"
              style={{ marginBottom: "25px" }}
            />

            <LAView className="grid gap-2 w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
              {currentItem?.choices?.map((options, index) => {
                const isSelected = selectedIndex
                  ? selectedIndex.selected == OPTIONS[index]
                  : false;

                return (
                  <>
                    <QuestionOptions
                      key={index + 1}
                      index={index}
                      item={options}
                      isShowAnswer={isShowAnswer}
                      correct={currentItem?.question?.correct_answer}
                      selected={selectedIndex ? selectedIndex.selected : "X"}
                      isSelected={isSelected}
                      isSubmit={isSubmitAnswer || selectedIndex?.is_from_older}
                      onPress={() => {
                        if (
                          Array.isArray(currentItem?.question?.correct_answer)
                        ) {
                          const previousSelected =
                            selectedIndex?.selected ?? [];
                          if (previousSelected.includes(OPTIONS[index])) {
                            const filter = previousSelected.filter(
                              (e) => e != OPTIONS[index]
                            );
                            setSelectedIndex({
                              selected: filter,
                              is_from_older: false,
                            });
                          } else {
                            previousSelected.push(OPTIONS[index]);
                            setSelectedIndex({
                              selected: previousSelected,
                              is_from_older: false,
                            });
                          }
                        } else {
                          const selected = OPTIONS[index];
                          if (!selectedIndex) {
                            setSelectedIndex({
                              selected: selected,
                              is_from_older: false,
                            });

                            let answer = {
                              question_id: currentItem?.question?.id,
                              selected: selected,
                            };

                            const items = [...savedAnswers];
                            items.push(answer);
                            setSavedAnswers(items);
                          }
                        }
                      }}
                    />
                  </>
                );
              })}
            </LAView>
            {isSubmitAnswer == false &&
              Array.isArray(currentItem?.question?.correct_answer) &&
              selectedIndex &&
              selectedIndex?.selected?.length > 0 &&
              !selectedIndex?.is_from_older && (
                <div className=" mt-10 w-1/2 text-center flex items-center justify-center mx-auto">
                  <LAButton
                    title="Submit Answer"
                    onPress={() => {
                      let answer = {
                        question_id: currentItem?.question?.id,
                        selected: selectedIndex.selected,
                      };

                      const items = [...savedAnswers];
                      items.push(answer);
                      setSavedAnswers(items);

                      setSubmitAnswer(true);

                      onUpdateScore();
                    }}
                  />
                </div>
              )}
            {isShowAnswer &&
              selectedIndex &&
              selectedIndex.selected != "X" &&
              (!Array.isArray(currentItem?.question?.correct_answer) ||
                isSubmitAnswer ||
                (selectedIndex && selectedIndex?.is_from_older)) && (
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
                </div>
              )}
          </div>
        ) : (
          <LAText
            className={`mt-4 text-center text-[${theme?.THEME_TEXT_BLACK}]`}
            size="small"
            font="400"
            color={theme?.THEME_TEXT_BLACK}
            title={STRINGS?.no_question_boomark}
          />
          // <div className="text-center mt-4">No questions available</div>
        )}
      </div>

      {questions?.length > 0 && (
        <TabFooter
          activeIndex={currentIndex}
          theme={theme}
          questionArrayaLength={questions?.length}
          onNext={onNext}
          onPrevious={onPrevious}
          isEndTest={false}
          upgradePlan="Questions"
        />
      )}

      {isCommunityPopup && (
        <CommunityPopup
          communitySettings={communitySettings}
          onCancle={() => {
            setCommunityPopup(false);
          }}
        />
      )}
    </LAView>
  );
};

export default Questions;
