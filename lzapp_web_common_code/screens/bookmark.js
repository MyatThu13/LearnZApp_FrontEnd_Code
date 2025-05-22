import { useContext, useEffect, useState } from "react";
import HTMLContent from "../components/HTMLContent";
import ExplanationComponent from "../components/ExplanationComponent";
//PACKAGES
import IconTint from "react-icon-tint";
// import { GET_QUESTION_FROM_ID } from "../../content/index";
import { useLocation, useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { STRINGS } from "../constant";
import { IMAGES, SVG_IMAGES } from "../assets";
import {
  GET_APP_DOMAIN_LIST,
  GET_STUDY_QUESTION_MENU,
} from "../../app_constant";
import { GET_COMMUNITY_SINGLE_QUESTION_DETAILS } from "../api/community";

//COMPONENTS
import {
  LAView,
  LAText
} from "../components";
import CommunityPopup from "./quickSet/CommunityPopup";
import OptionButton from "../components/question/OptionButton";

// CONTEXT
import { AuthContext } from "../context/AuthProvider";
import { BundleContext } from "../context/BundleProvider";
import { ThemeContext } from "../context/ThemeProvider";
import BackArrowIcon from "../components/BackArrowIcon";
import BookmarkIcons from "../components/BookmarkIcons";
import TabFooter from "../components/TabFooter";
import { MixpanelContext } from "../context/MixpanelProvider";
import { GET_QUESTION_FROM_ID } from "../api/test";

function Bookmark() {
  const { state } = useLocation();

  const title = state?.title ?? STRINGS.study_questions_title;
  const lastIndex = state?.lastIndex ?? 0;
  const set_id = state?.set_id ?? "";
  const questionsListGet = state?.questions ?? [];
  const isShowPop = state?.isShow;

  const [bookmarkQuestions, setBookmarkQuestions] = useState([]);
  const { selectedCertificate } = useContext(BundleContext);
  const [quickSetState, setQuickSetState] = useState({
    selectedOpion: null,
  });
  const STUDY_QUESTION_MENU = GET_STUDY_QUESTION_MENU(selectedCertificate);
  const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [isLoadingCommunityData, setLoadingCommunityData] = useState(false);
  const [questions, setQuestions] = useState(questionsListGet);

  const [currentIndex, setCurrentIndex] = useState(lastIndex);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [communityQuestion, setCommunityQuestion] = useState(null);
  const [isCommunityPopup, setCommunityPopup] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isProgressQuestion, setProgressQuestion] = useState(false);
  const [selectedTopicBookmark, setSelectedTopicBookmark] = useState(null);
  const [isProgressProgressBookmark, setProgressBookmark] = useState(false);

  const {
    questionsList,
    addQuestionProgress,
    addQuestionScore,
    isVisibleCommunity,
    removeQuestionFromBookmark,
    profile,
  } = useContext(AuthContext);
  const { trackBookmark, trackQuestionBookmark } = useContext(MixpanelContext);

  const { theme, currentTheme } = useContext(ThemeContext);
  const navigation = useNavigate();

  const onChange = () => {};

  useEffect(() => {
    trackBookmark();
    // trackStudyQuestions("Bookmarks");

    const progress = profile.questions_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.study_questions_set_id == "bookmark";
    });

    const array = profile?.question_bookmarks ?? [];
    const questions = questionsList?.filter((e) => array.includes(e.id));
    setBookmarkQuestions(questions);

    if (
      (setProgress,
      setProgress.length > 0,
      questions[0]?.id !== setProgress[0]?.last_seen_question_id)
    ) {
      setSelectedTopicBookmark(STUDY_QUESTION_MENU?.[0]);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (bookmarkQuestions.length > lastIndex) {
        setCurrentIndex(lastIndex);
      }
    }, 300);
  }, []);

  useEffect(() => {
    if (selectedTopic) {
      setProgressQuestion(true);
    }
  }, [selectedTopic]);

  function onActionBookmark(index) {
    const item = selectedTopic;
    if (index == 0) {
      const array = profile?.question_bookmarks ?? [];
      const questions = questionsList?.filter((e) => array.includes(e.id));
    } else if (index == 1) {
      const progress = profile.questions_progress;
      const setProgress = progress.filter(
        (obj) => obj.study_questions_set_id == "bookmark"
      );
      const array = profile?.question_bookmarks ?? [];
      const questions = questionsList?.filter((e) => array.includes(e.id));
      if (setProgress.length > 0) {
        const index = questions.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_question_id
        );
        setCurrentIndex(index == -1 ? 0 : index);
      }
    }
  }

  useEffect(() => {
    if (selectedTopicBookmark) {
      setProgressBookmark(true);
    }
  }, [selectedTopicBookmark]);

  const setSelectedAnswer = (questionId, selectedOption) => {
    setQuickSetState((prev) => ({
      ...prev,
      selectedOpion: selectedOption,
    }));
  };

  useEffect(() => {
    const question = bookmarkQuestions[currentIndex];
    if (bookmarkQuestions.length > currentIndex && set_id) {
      addQuestionProgress(set_id, question?.id);
    }

    const index = savedAnswers.findIndex((e) => e.question_id == question?.id);
    if (index >= 0) {
      setSelectedIndex({
        selected: savedAnswers[index].selected,
        is_from_older: true,
      });
    }

    if (true && question) {
      setCommunityQuestion(null);
      getCommunityQuestion(question?.id);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (selectedIndex) {
      if (selectedIndex.is_from_older == false) {
        onUpdateScore();
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
    if (selectedIndex && selectedIndex.selected != "X") {
      //UPDATE USER SCORE
      addQuestionScore(
        currentItem?.question?.id,
        currentItem?.question.topic_id,
        currentItem?.question.correct_answer == selectedIndex.selected
      );
    }
  }

  function getCurrentQuestion() {
    if (bookmarkQuestions.length > currentIndex) {
      return GET_QUESTION_FROM_ID(
        questionsList,
        bookmarkQuestions[currentIndex]?.id
      );
    }

    return null;
  }

  function getTopicId() {
    if (bookmarkQuestions.length > currentIndex) {
      const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
      const array = APP_DOMAIN_LIST.find(
        (item) => item.id == bookmarkQuestions[currentIndex].topic_id
      );
      return array?.domain_name ?? "";
    }

    return "";
  }

  function onPrevious() {
    // trackReadinessScore(profile?.readiness_scores?.readiness_score ?? '')
    setSelectedIndex(null);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    setCurrentIndex((state) => {
      return state == 0 ? 0 : state - 1;
    });
  }

  function onNext() {
    // trackReadinessScore(profile?.readiness_scores?.readiness_score ?? '')
    setSelectedIndex(null);
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false })

    setCurrentIndex((state) => {
      return state == bookmarkQuestions.length - 1 ? 0 : state + 1;
    });
  }

  function onBookmark() {
    if (bookmarkQuestions.length > currentIndex) {
      const question = bookmarkQuestions[currentIndex];
      if (isBookmark) {
        trackQuestionBookmark(-1);
        removeQuestionFromBookmark(question?.id);
      }
    }
  }

  function checkBookmark() {
    if (bookmarkQuestions.length > currentIndex) {
      const question = bookmarkQuestions[currentIndex];
      return profile?.question_bookmarks?.includes(question.id) ?? false;
    }

    return false;
  }

  function onPressCommunity() {
    setCommunityPopup(true);
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
    <>
      {/* <LAView>
      <Header onChange={() => {}} onProfile={() => {}} /> */}
      <LAView className="px-[24px]">
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
            className="flex line-clamp-1 truncate"
            size="medium"
            font="600"
            color={"black"}
            title={STRINGS.bookmark}
          />
        </div>
        <LAView className="mt-4" />
        {bookmarkQuestions?.length > 0 ? (
          <>
            <div className="my-2 flex items-center justify-between border-b border-dashed pb-3">
              <h4
                className={`text-base font-semibold text-[${theme?.THEME_TEXT_BLACK}] `}
                style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
              >
                {`${STRINGS.question} ${currentIndex + 1}`}/
                <span className="text-sm font-normal ">
                  {bookmarkQuestions?.length}
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
                      {/* <img
                        width={20}
                        height={30}
                        src={IMAGES?.community}
                        alt="comunity"
                        style={
                          currentTheme !== "light"
                            ? { filter: "invert(1)" }
                            : { filter: "none" }
                        }
                      /> */}
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
            {currentItem && bookmarkQuestions?.length > 0 ? (
              <div className="question-container mb-20 question-scrollbar ">
                
                <HTMLContent htmlContent={currentItem?.question?.question} />

                <LAView className="grid gap-2 w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
                  {currentItem?.choices?.map((options, index) => {
                    const isSelected = selectedIndex
                      ? selectedIndex.selected == OPTIONS[index]
                      : false;

                    return (
                      <OptionButton
                        key={index}
                        ID={index}
                        questionOptions={options}
                        option={OPTIONS?.[index]}
                        correct={currentItem?.question?.correct_answer}
                        isShowAnswer={true}
                        isShowAnswerFlag={true}
                        selected={quickSetState?.selectedOpion}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        OPTIONS={OPTIONS}
                        savedAnswers={savedAnswers}
                        setSavedAnswers={setSavedAnswers}
                        onClick={() => {
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

                            setSavedAnswers([...savedAnswers, answer]);
                          }
                        }}
                        currentItem={currentItem}
                      />
                      // state={quickSetState}

                      // setState={setQuickSetState}
                    );
                  })}
                </LAView>
                {true && selectedIndex && selectedIndex.selected != "X" && (
                  <div className="pt-6">
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
              ""
            )}

            <TabFooter
              activeIndex={currentIndex}
              theme={theme}
              questionArrayaLength={bookmarkQuestions?.length}
              onNext={onNext}
              onPrevious={onPrevious}
              isEndTest={false}
            />
            {/* <LAView
              flex="row"
              background="secondary"
              className="flex mx-4 mb-20 sm:mb-20 md:mb-20 lg:mb-0 pb-2 lg:pl-[150px] pl-[0px] lg:pb-3  fixed w-full bottom-0 left-0 right-0 mt-3 py-2 px-4 sm:px-6 py-4 items-center justify-between"
            >
              <LAView
                onClick={() => onPrevious()}
                className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 lg:px-10 py-4 ${
                  currentIndex !== 0
                    ? "bg-black text-white"
                    : "bg-[#f2f2f2] text-black"
                } rounded-full`}
              >
                <LAText
                  className={
                    currentIndex !== 0
                      ? "bg-black text-white"
                      : "bg-[#f2f2f2] text-black"
                  }
                  size="small"
                  font="400"
                  color={""}
                  title={"❮"}
                />
                <LAView className="mx-1" />
                <LAText
                  className={
                    currentIndex !== 0
                      ? "bg-black text-white"
                      : "bg-[#f2f2f2] text-black"
                  }
                  size="small"
                  font="400"
                  color={"gray"}
                  title={STRINGS.previous}
                />
              </LAView>
              <LAView
                onClick={() => onNext()}
                className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 f lg:px-10 py-4 ${
                  selectedIndex?.selected || currentIndex !== 0
                    ? "bg-black text-white"
                    : "bg-[#f2f2f2] text-black"
                } rounded-full`}
              >
                <LAText
                  className={
                    selectedIndex?.selected || currentIndex !== 0
                      ? "bg-black text-white"
                      : "bg-[#f2f2f2] text-black"
                  }
                  size="small"
                  font="400"
                  color={"gray"}
                  title={"Next"}
                />
                <LAView className="mx-1" />
                <LAText
                  className={
                    selectedIndex?.selected || currentIndex !== 0
                      ? "bg-black text-white"
                      : "bg-[#f2f2f2] text-black"
                  }
                  size="small"
                  font="400"
                  color={""}
                  title={"❯"}
                />
              </LAView>
            </LAView> */}

            {isCommunityPopup && (
              <CommunityPopup
                communitySettings={communitySettings}
                onCancle={() => {
                  setCommunityPopup(false);
                }}
              />
            )}
          </>
        ) : (
          <LAView className="px-[24px] pt-20 ">
            <div className="w-full flex flex-col justify-center items-center h-[50vh]">
              <img src={IMAGES.ic_tab_bookmark} width={60} className="pb-6" />
              <h5 className="text-gray-400">{STRINGS.no_question_boomark}</h5>
            </div>
          </LAView>
        )}
      </LAView>

      
    </>
  );
}

function BoomarkItem(props) {
  return (
    <LAView>
      <LAView key={props.key} flex="row" className="flex">
        <LAView flex="col" className="flex">
          <LAText
            size="small"
            font="400"
            color={"gray2"}
            title={"Question 1"}
          />
          <LAText
            className="line-clamp-1 mr-10 mt-1"
            size="regular"
            font="500"
            color={"black"}
            title={
              "Which one of the following actions is not normally part of the project scope and planning phase of Which one of the following actions is not normally part of the project scope and planning phase of"
            }
          />
        </LAView>
        <IconTint
          color={"#007054"}
          className="
                                    mb-1
                                    h-[20px] sm:h-[22px] md:h-[24px] lg:h-[26px]
                                    w-[20px] sm:w-[22px] md:w-[24px] lg:w-[26px]
                                                                        "
          src={IMAGES.ic_tab_bookmark}
        />
      </LAView>
      <LAView className="border-[1px] border-[#E2E8F1] my-[16px]" />
    </LAView>
  );
}

export default Bookmark;
