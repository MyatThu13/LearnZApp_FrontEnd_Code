//PACKAGES
import { useLocation, useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { STRING, STRINGS } from "../constant";
import { IMAGES, SVG_IMAGES } from "../assets";

//COMPONENTS
import { Header, LAView, LAText} from "../components";
import HTMLContent from "../components/HTMLContent";
import ExplanationComponent from "../components/ExplanationComponent";
import AnswerMessage from "../components/AnswerMessage";

//PACKAGES
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconTint from "react-icon-tint";
import { AuthContext } from "../context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { BundleContext } from "../context/BundleProvider";
import { GET_COMMUNITY_SINGLE_QUESTION_DETAILS } from "../api/community";
import { GET_APP_DOMAIN_LIST } from "../../app_constant";
// import { GET_QUESTION_FROM_ID } from "../../content";
import OptionButton from "../components/question/OptionButton";
import BackArrowIcon from "../components/BackArrowIcon";

import { ThemeContext } from "../context/ThemeProvider";
import { MixpanelContext } from "../context/MixpanelProvider";
import QuestionOptions from "../components/question/QuestionOptions";
import BookmarkIcons from "../components/BookmarkIcons";
import CommunityPopup from "./quickSet/CommunityPopup";
import TabFooter from "../components/TabFooter";
import { GET_QUESTION_FROM_ID } from "../api/test";

function QuestionReview() {
  const { state } = useLocation();
  const { theme, currentTheme } = useContext(ThemeContext);
  const { trackQuestionBookmark } = useContext(MixpanelContext);
  const title = state?.title;
  const item = state?.item;
  const questions = state?.state;
  const lastReadinessScore = state?.lastReadinessScore;
  console.log("state", state);

  const {
    profile,
    questionsList,
    addQuestionToBookmark,
    removeQuestionFromBookmark,
    isVisibleCommunity,
  } = useContext(AuthContext);
  const navigation = useNavigate();
  const { selectedCertificate } = useContext(BundleContext);

  const [isLoadingCommunityData, setLoadingCommunityData] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [quickSetState, setQuickSetState] = useState({
    selectedOpion: null,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [communityQuestion, setCommunityQuestion] = useState(null);
  const [isCommunityPopup, setCommunityPopup] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [savedAnswers, setSavedAnswers] = useState([]);
  const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  useEffect(() => {
    if (isVisibleCommunity) {
      setCommunityQuestion(null);

      if (questions?.length > 0 && !isNaN(currentIndex)) {
        const question = questions[currentIndex];
        getCommunityQuestion(question.question_id);
      }
    }
  }, [currentIndex]);

  function getCurrentQuestion() {
    if (questions?.length > 0 && !isNaN(currentIndex)) {
      const id = questions[currentIndex].question_id;
      return GET_QUESTION_FROM_ID(questionsList, id);
    }

    return null;
  }

  function getTopicId() {
    const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
    const array = APP_DOMAIN_LIST?.find(
      (item) => item?.id == questions[currentIndex]?.topic_id
    );
    return array?.domain_name ?? "";
  }

  function onBack() {
    navigation(-1);
    // props.navigation.goBack();
  }

  function onPrevious() {
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    setCurrentIndex((state) => {
      return state == 0 ? 0 : state - 1;
    });
  }

  function onNext() {
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
    setCurrentIndex((state) => {
      return state == questions?.length - 1 ? 0 : state + 1;
    });
  }

  function onBookmark() {
    if (questions?.length > currentIndex) {
      const question = questions[currentIndex];
      if (isBookmark) {
        trackQuestionBookmark(-1);
        removeQuestionFromBookmark(question.question_id);
      } else {
        trackQuestionBookmark(1);
        addQuestionToBookmark(question.question_id);
      }
    }
  }

  function checkBookmark() {
    if (questions?.length > currentIndex) {
      const question = questions[currentIndex];
      return (
        profile?.question_bookmarks?.includes(question.question_id) ?? false
      );
    }

    return false;
  }

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
      // setLoading(false);
      console.error(error);
      setCommunityQuestion(null);
    }
  }

  function getCommunityQuestionPercentage() {
    if (communityQuestion && isVisibleCommunity) {
      const percentage =
        (communityQuestion?.times_answered_correct /
          communityQuestion?.times_answered) *
        100;
      if (isNaN(percentage) || !isFinite(percentage)) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRING.community_popup_desc_less_50,
        };
      } else if (percentage < 50) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRING.community_popup_desc_less_50,
        };
      } else if (percentage < 80) {
        return {
          color: theme.COLOR_YELLOW,
          percentage: 0,
          message: STRING.community_popup_desc_less_80,
        };
      } else {
        return {
          color: theme.COLOR_GREEN,
          percentage: 0,
          message: STRING.community_popup_desc_less_100,
        };
      }
    }

    return {
      // color: theme.COLOR_RED,
      percentage: 0,
      message: STRING.community_popup_desc_less_50,
    };
  }

  function onPressCommunity() {
    setCommunityPopup(true);
  }

  const isBookmark = checkBookmark();
  const currentItem = getCurrentQuestion();
  const topic = getTopicId();
  const communitySettings = getCommunityQuestionPercentage();

  return (
    <LAView className="relative w-full" type="">
      <div className="page-heading mx-4 my-4">
        <div className="flex gap-2 items-center">
          <button
            className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
            onClick={() => {
              navigation("/testReview", { state: { historyData: item, canGoBackKey: false, lastReadinessScore } });
            }}
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
            title={"Review Test"}
          />
        </div>

        <div className="my-2 flex items-center justify-between border-b border-dashed pb-2">
          <h4
            className="text-base font-semibold "
            style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
          >
            {`${title} ${currentIndex + 1}`}/
            <span className="text-sm font-normal ">{questions?.length}</span>
          </h4>

          {/* <div className="flex gap-4">
            {selectedIndex?.selected && (
              <>
                <div
                  onClick={() => setCommunityPopup(true)}
                  className="cursor-pointer"
                >
                  <img
                    width={20}
                    height={30}
                    src={IMAGES?.community}
                    alt="comunity"
                  />
                </div>
              </>
            )}
            <img
              width={20}
              onClick={() => onBookmark()}
              height={30}
              title="Bookmark"
              src={
                isBookmark
                  ? IMAGES.ic_book_mark_selected
                  : IMAGES.ic_book_mark_unselected
              }
              alt="bookmark save"
            />
          </div> */}

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

        {currentItem && questions?.length > 0 ? (
          <div className="p-4">
            {/* <p className="text-sm sm:text-sm md:text-base lg:text-base font-medium my-2" style={{ color: `${theme?.THEME_TEXT_BLACK}` }}>
              {currentItem?.question?.question}
            </p> */}

            {/* <QuestionOptions
              correct={currentItem.question?.correct_answer}
              selected={
                questions[currentIndex]?.selected_choice == "X"
                  ? currentItem.question?.correct_answer
                  : questions[currentIndex]?.selected_choice
              }
              isShowAnswer={true}
              key={currentIndex}
              index={currentIndex}
              item={currentItem}
            /> */}
            <div className="pt-6">
              <HTMLContent htmlContent={currentItem?.question?.question} />
            </div>
            <div className="pt-6">
              <LAView className="grid gap-2 w-full grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
                {currentItem?.choices?.map((options, index) => {
                  const isSelected = true;
                  return (
                    <OptionButton
                      key={index}
                      ID={index}
                      isShowAnswerFlag={true}
                      questionOptions={options}
                      option={OPTIONS?.[index]}
                      correct={currentItem?.question?.correct_answer}
                      isShowAnswer={currentItem?.question?.answer}
                      onClick={(e) => e}
                      selected={
                        state?.state[currentIndex]?.selected_choice == "X"
                          ? currentItem?.question?.correct_answer
                          : state?.state[currentIndex]?.selected_choice
                      }
                      selectedIndex={{
                        selected:
                          state?.state[currentIndex]?.selected_choice == "X"
                            ? currentItem?.question?.correct_answer
                            : state?.state[currentIndex]?.selected_choice,
                      }}
                      OPTIONS={OPTIONS}
                      savedAnswers={savedAnswers}
                      setSavedAnswers={setSavedAnswers}
                      currentItem={currentItem}
                    />
                  );
                })}
              </LAView>
            </div>
            {true && (
              <div className="pt-6">
                <AnswerMessage
                    correct_answer={currentItem?.question?.correct_answer}
                    selected_answer={state?.state[currentIndex]?.selected_choice}
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
          ""
        )}
      </div>
      <TabFooter
        activeIndex={currentIndex}
        theme={theme}
        questionArrayaLength={questions?.length}
        onNext={onNext}
        onPrevious={onPrevious}
        isEndTest={false}
      />
      {/* <LAView
        flex="row"
        background=""
        className=" bg-[#F5F5F7] flex mx-4 mb-20 sm:mb-20 md:mb-20 lg:mb-4 pb-2 lg:pl-[150px] pl-[0px] lg:pb-3  fixed w-full bottom-0 left-0 right-0 mt-3 py-2 px-4 sm:px-6 py-4 items-center justify-between"
      >
        <LAView
          onClick={() => onPrevious()}
          className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 lg:px-10 py-4 ${
            currentIndex !== 0 ? "bg-[#ffff]" : "bg-[#f2f2f2]"
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
        <LAView
          onClick={() => onNext()}
          className={`flex-row flex px-4 cursor-pointer sm:px-6 md:px-8 lg:px-10 py-4 ${
            selectedIndex?.selected || currentIndex !== 0
              ? "bg-[#ffff]"
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
}

export default QuestionReview;
