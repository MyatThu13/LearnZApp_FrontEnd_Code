//PACKAGES
import { useLocation, useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { STRING, STRINGS } from "../constant";
import { IMAGES } from "../assets";

//COMPONENTS
import {
  Header,
  LAView,
  LAText,
  LAWarningPopup,
  LAButton,
} from "../components";

//PACKAGES
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconTint from "react-icon-tint";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { GET_COMMUNITY_MULTIPLE_QUESTION_DETAILS } from "../api/community";
import CommunityPopup from "./quickSet/CommunityPopup";
import BackArrowIcon from "../components/BackArrowIcon";
import { ThemeContext } from "../context/ThemeProvider";
import { MixpanelContext } from "../context/MixpanelProvider";
import { GET_APP_DOMAIN_LIST } from "../../app_constant";
import { BundleContext } from "../context/BundleProvider";
import ReadinessScoreImpact from "../components/ReadinessScoreImpact";

function TestReview() {
  //const { state, canGoBackKey, lastReadinessScore } = useLocation();
  
  const location = useLocation();
    const { historyData, canGoBackKey, lastReadinessScore } = location.state || {};
  const state = historyData;
  
  
  const navigation = useNavigate();
  const testItem = state;
  const canGoBack = canGoBackKey;
  const { theme, currentTheme } = useContext(ThemeContext);
  const { deleteTestHistory, profile, isVisibleCommunity } =
    useContext(AuthContext);
  const { trackPracticeReview } = useContext(MixpanelContext);
  const { selectedCertificate } = useContext(BundleContext);
  const [isLoadingCommunity, setLoadingCommunity] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isDeleteWarning, setDeleteWarning] = useState(false);
  const [isTestExitPopup, setTestExitPopup] = useState(false);
  const [communityDetails, setCommunityDetails] = useState(null);
  const [communityPercentage, setCommunityPercentage] = useState(0);
  const [isCommunityPopup, setCommunityPopup] = useState(false);
  const [domainList, setDomainList] = useState([]);
  

  const lastReadinessScoreInt = lastReadinessScore !== undefined ? Math.round(lastReadinessScore) : null;
  const profileReadinessScoreInt = profile?.readiness_scores?.readiness_score !== undefined ? Math.round(profile.readiness_scores.readiness_score) : null;


  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);

  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, []);

  useEffect(() => {
    getScoreAsPerDomain();
    if (testItem?.test_questions_meta_data && isVisibleCommunity) {
      const array = testItem?.test_questions_meta_data?.map(
        (e) => `${e.question_id}`
      );
      getCommunityDetails(array);
    }
  }, []);

  async function getCommunityDetails(ids) {
    setLoadingCommunity(true);
    const result = await GET_COMMUNITY_MULTIPLE_QUESTION_DETAILS(ids);
    setLoadingCommunity(false);

    if (result?.data?.length > 0) {
      const total_time_answered = result?.data
        .map((item) => item.times_answered)
        .reduce((prev, next) => prev + next);
      const total_time_correct = result?.data
        .map((item) => item.times_answered_correct)
        .reduce((prev, next) => prev + next);

      setCommunityDetails(result.data);

      const percentage = (total_time_correct / total_time_answered) * 100;
      setCommunityPercentage(percentage);
    } else {
      setCommunityDetails([]);
      setCommunityPercentage(0);
    }
  }

  function getProgress() {
    let value = testItem?.score;
    const progress = parseInt((value * 100) / 200);
    const fill = isNaN(value) ? 0 : value;
    return { fill, value };
  }

  function getAvarageTime() {
    const avg_time = Math.floor(testItem?.time_taken / testItem?.total);
    return avg_time + "s";
  }

  const backAction = () => {
    onBack();
    return false;
  };

  function onBack() {
    if (canGoBack) {
      navigation(-1);
    } else {
      setTestExitPopup(true);
    }
  }

  function onAllQuestionReview() {
    if (testItem?.test_questions_meta_data?.length > 0) {
      trackPracticeReview("All");
      // props.navigation.navigate(SCREENS.QuestionReview.identifier, {
      //     title: STRING.all,
      //     questions: testItem.test_questions_meta_data
      // })
      navigation("/questionReview", {
        state: {
          state: testItem?.test_questions_meta_data,
          title: "All",
          item: testItem,
          lastReadinessScore: lastReadinessScore,
        },
        // state: state?.test_questions_meta_data,
      });
    }
  }

  function onUnanswerQuestionReview() {
    const questions = testItem?.test_questions_meta_data?.filter(
      (item) => item.response == STRING?.unanswered_tag
    );
    if (questions.length > 0) {
      trackPracticeReview("Unanswered");
      // props.navigation.navigate(SCREENS.QuestionReview.identifier, {
      //     title: STRING.unanswered,
      //     questions: questions
      // })
      navigation("/questionReview", {
        state: { 
          state: questions, 
          title: "Unanswered", 
          item: testItem,
          lastReadinessScore: lastReadinessScore, 
        },
        // state: questions,
        // title: STRING,
      });
    }
  }

  function onCorrectQuestionReview() {
    const questions = testItem?.test_questions_meta_data?.filter(
      (item) => item.response == STRING.correct_tag
    );
    if (questions.length > 0) {
      trackPracticeReview("Correct");
      // props.navigation.navigate(SCREENS.QuestionReview.identifier, {
      //     title: STRING.correct,
      //     questions: questions
      // })

      navigation("/questionReview", {
        state: { 
          state: questions, 
          title: "Correct", 
          item: testItem,
          lastReadinessScore: lastReadinessScore, 
        },
      });
    }
  }

  function onIncorrectQuestionReview() {
    const questions = testItem?.test_questions_meta_data?.filter(
      (item) => item.response == STRING.incorrect_tag
    );
    if (questions.length > 0) {
      trackPracticeReview("Incorrect");
      // props.navigation.navigate(SCREENS.QuestionReview.identifier, {
      //     title: STRING.incorrect,
      //     questions: questions
      // })

      navigation("/questionReview", {
        state: { 
          state: questions, 
          title: "Incorrect", 
          item: testItem,
          lastReadinessScore: lastReadinessScore, 
        },
      });
    }
  }

  async function onDelete() {
    deleteTestHistory(testItem);
    navigation("/history", { state: { isShowReview: false } });
    // props.navigation.dispatch(
    //     CommonActions.reset({
    //         index: 0,
    //         routes: [
    //             {
    //                 name: SCREENS.Tabbar.identifier,
    //                 params: {
    //                     isShowReview: false
    //                 }
    //             }
    //         ],
    //     })
    // );
  }

  function onRetakeTest() {
    const question_date = testItem?.test_questions_meta_data ?? [];
    const item = {
      test_name: testItem.test_name,
      test_questions_meta_data: question_date,
      num_questions: question_date.length,
      is_retake_test: true,
      is_show_answer: false,
    };
    navigation("/test", { state: item, isShowAnswer: false });

    // props.navigation.push(SCREENS.Test.identifier, {
    //     test: item,
    //     isShowAnswer: false
    // })
  }

  function getCommunityTestResult() {
    if (communityDetails && isVisibleCommunity) {
      if (isNaN(communityPercentage) || !isFinite(communityPercentage)) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRING.community_test_popup_desc_less_50,
        };
      } else if (communityPercentage < 50) {
        return {
          color: theme.COLOR_RED,
          percentage: 0,
          message: STRING.community_test_popup_desc_less_50,
        };
      } else if (communityPercentage < 80) {
        return {
          color: theme.COLOR_YELLOW,
          percentage: 0,
          message: STRING.community_test_popup_desc_less_80,
        };
      } else {
        return {
          color: theme.COLOR_GREEN,
          percentage: 0,
          message: STRING.community_test_popup_desc_less_100,
        };
      }
    }

    return {
      color: theme.COLOR_RED,
      percentage: 0,
      message: STRING.community_test_popup_desc_less_50,
    };
  }

  function onPressCommunity() {
    setCommunityPopup(true);
  }

  const questionReviewHandler = (e) => {
    switch (e?.name) {
      case "All":
        onAllQuestionReview();
        break;

      case "Unanswered":
        onUnanswerQuestionReview();
        break;

      case "Correct":
        onCorrectQuestionReview();
        break;

      case "Incorrect":
        onIncorrectQuestionReview();
        break;

      default:
        onAllQuestionReview();
        break;
    }
  };

  function getScoreAsPerDomain() {
    const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
    const domainScoreList = [];

    APP_DOMAIN_LIST.forEach((domain) => {
      const totalQuestion = (testItem?.test_questions_meta_data ?? []).filter(
        (e) => e.topic_id == domain.id
      );
      const correctQuestion = (testItem?.test_questions_meta_data ?? []).filter(
        (e) => e.topic_id == domain.id && e.response == "CORRECT"
      );
      const percentage =
        ((100 * correctQuestion?.length) / totalQuestion?.length).toFixed(2);
      if (totalQuestion?.length > 0) {
        domainScoreList.push({
          id: domain.id,
          title: domain.domain_name,
          value: `${percentage}%`,
          total: totalQuestion?.length,
          percentage: percentage,
          correct: correctQuestion?.length,
        });
      }
    });

    setDomainList(domainScoreList);
  }

  function onPressDomain(domain) {
    const questions = (testItem?.test_questions_meta_data ?? []).filter(
      (e) => e.topic_id == domain.id
    );
    if (questions.length > 0) {
      trackPracticeReview("Domain");
      navigation("/questionReview", {
        state: {
          state: questions,
          title: domain.title,
          item: testItem,
          questions: questions,
          lastReadinessScore: lastReadinessScore, 
        },
        // state: state?.test_questions_meta_data,
      });
      // props.navigation.navigate(SCREENS.QuestionReview.identifier, {
      //   title: domain.name,
      //   questions: questions,
      // });
    }
  }

  const progress = getProgress();
  const time = getAvarageTime();
  const testName = testItem?.test_name?.trim() ? testItem?.test_name : "-";
  const testDate = testItem?.date?.trim() ? testItem?.date : "-";
  const communitySettings = getCommunityTestResult();

  return (
    <>
      <LAView>
        {/* <Header onChange={() => {}} onProfile={() => {}} /> */}
        <LAView className="grid grid-cols-12 gap-[24px] px-[24px]">
          <LAView className="col-span-12 md:col-span-6 h-full">
            <LAView flex="row" className="mb-3 flex items-center">
              <button
                className="p-2 rounded-lg border-2 border-[#000] dark:border-[#fff]"
                onClick={() => {
                  navigation("/history");
                }}
              >
                <BackArrowIcon
                  color={currentTheme === "light" ? "#101010" : "#fff"}
                />
              </button>
              <LAView flex="col" className="flex-1 mx-6">
                <LAText
                  className="flex line-clamp-1 truncate"
                  size="medium"
                  font="600"
                  color={"black"}
                  title={testName}
                />
                <LAText
                  className="flex line-clamp-1 truncate"
                  size="small"
                  font="600"
                  color={"gray"}
                  title={testDate}
                />
              </LAView>
              <button onClick={() => setDeleteWarning(true)}>
                <LAView
                  type="center"
                  className="h-[40px] w-[40px] md:h-[48px] md:w-[48px] bg-[#E24C5B] rounded-[12px]"
                  styles={{ backgroundColor: theme.COLOR_RED }}
                >
                  <IconTint
                    className="w-[20px] h-[20px]"
                    src={IMAGES.ic_delete}
                    color="#fff"
                  />
                </LAView>
              </button>
            </LAView>

            <div className="bg-lz-blue-4 dark:bg-lz-blue-10 rounded-2xl flex flex-col items-center justify-center mt-10">
              <div className="w-1/2 h-1/2 mt-10">
                <CircularProgressbar
                  value={progress.value}
                  text={`${progress.value}%`}
                  circleRatio={0.75}
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    pathColor: theme.COLOR_LZ_BLUE_6,
                    textColor: theme.THEME_TEXT_BLACK,
                    textSize: "1.1rem",
                    backgroundColor: theme.COLOR_LZ_BLUE_2,
                    trailColor: theme.COLOR_LZ_BLUE_1,
                    rotation: 1 / 2 + 1 / 8,
                  })}
                />
              </div>
              <span className="mb-10 text font-normal text-black dark:text-gray-100">
                {STRING.average_time_per_question + time}
              </span>
            </div>
            {lastReadinessScore !== undefined && (
              <div className="p-4">
                <ReadinessScoreImpact
                  lastReadinessScoreInt={lastReadinessScoreInt}
                  profileReadinessScoreInt={profileReadinessScoreInt}
                />
              </div>
            )}
            <div className="mt-10 flex justify-center">
              <button
                onClick={onRetakeTest}
                className="bg-lz-blue-4 dark:bg-lz-blue-8 text-black dark:text-white text-xl font-semibold p-6 rounded-full transition-colors duration-300 w-1/2 hover:bg-lz-blue-3 dark:hover:bg-lz-blue-7"
              >
                Retake Test
              </button>
            </div>
            
          </LAView>
          <LAView className="col-span-12 md:col-span-6 gap-[24px] my-20">
            <LAView
              flex="col"
              className="flex md:overflow-y-auto md:max-h-[75vh] lg:max-h-[85vh] md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] md:px-[24px] md:pb-[24px] mt-8"
            >
              <LAView
                flex="row"
                className="flex justify-between items-center mt-[24px] mb-4"
              >
                <LAText
                  size="medium"
                  font="600"
                  color={"black"}
                  title={STRINGS?.review_questions}
                />

                <div
                  onClick={() => onPressCommunity()}
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

                {/* <button onClick={() => onPressCommunity()}>
                  <IconTint
                    className="w-[20px] h-[20px]"
                    src={IMAGES.community}
                    color="#ff0000"
                  />
                </button> */}
              </LAView>
              {[
                { name: "All", total: testItem?.total },
                { name: "Unanswered", total: testItem?.unanswered },
                { name: "Correct", total: testItem?.correct },
                { name: "Incorrect", total: testItem?.incorrect },
              ].map((e, index) => {
                return (
                  <TestReviewItem
                    key={index}
                    item={e}
                    title={e?.name ?? ""}
                    onClick={() => {
                      questionReviewHandler(e);
                      // onAllQuestionReview();
                      // navigation("/questionReview");
                    }}
                  />
                );
              })}
            </LAView>

            <LAView
              flex="col"
              className="flex md:overflow-y-auto md:max-h-[75vh] lg:max-h-[85vh] md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] md:px-[24px] md:pb-[24px] mt-8"
            >
              <LAText
                size="medium"
                font="600"
                color={"black"}
                title={STRING.review_domain_wise_scores}
                className="mt-[24px] mb-4"
              />
            <div>
              {domainList.map((e, index) => {
                return (
                  <TestReviewItem
                    item={e}
                    key={e.title + index}
                    title={e?.title ?? ""}
                    value={e?.value ?? 0}
                    percentage={e?.percentage ?? ""}
                    correctQuestion={e?.correct ?? 0}
                    totalQuestion={e?.total ?? 0}
                    type="domain"
                    onClick={() => {
                      onPressDomain(e);
                    }}
                  />
                );
              })}
            </div>
            </LAView>

            
          </LAView>
        </LAView>
      </LAView>

      {isDeleteWarning && (
        <LAWarningPopup
          title={STRING.are_you_sure}
          desc={STRING.test_delete_warning}
          cancelText={STRING.no}
          options={[STRING.no, STRING.delete]}
          onCancle={() => {
            setDeleteWarning(false);
          }}
          onPress={async (e, index) => {
            setDeleteWarning(false);
            if (index == 1) {
              onDelete();
            }
          }}
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
    </>
  );
}

function TestReviewItem(props) {
  const { theme } = useContext(ThemeContext);

  const title= props?.title ?? "";
  const value= props?.item?.value ?? 0;
  const percentage= props?.item?.percentage ?? "";
  const correctQuestion= props?.item?.correct ?? 0;
  const totalQuestion= props?.item?.total ?? 0;
  const onClick= props?.onClick;
  const type= props?.type;
                    

  function getProgressColor(percentage) {
    if (percentage >= 70) {
      return theme.COLOR_GREEN;
    } else if (percentage < 40) {
      return theme.COLOR_RED;
    } else {
      return theme.COLOR_YELLOW;
    }
  }
  const getProgressBarColor = (readinessScore) => {
    if (readinessScore < 25) return "bg-red-500";
    if (readinessScore >= 25 && readinessScore <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div
      onClick={onClick}
      key={title}
      className="flex text-lg text-black dark:text-white items-center w-full p-4 mt-4 cursor-pointer rounded-lg bg-lz-blue-1 dark:bg-lz-blue-10 shadow-md transition-colors duration-300 hover:bg-lz-blue-2 dark:hover:bg-lz-blue-9"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-lz-blue-3 dark:bg-lz-blue-8 text-white">
        <p
          className={
            percentage || percentage === 0 ? "text-sm" : ""
          }
        >
          {totalQuestion}
        </p>
      </div>
      <div className="ml-3 flex-grow">
        <p>{title}</p>
        {type == "domain" && (
          <p
          className={`text-sm font-bold ${
            percentage < 25
              ? 'text-red-500'
              : percentage <= 75
              ? 'text-yellow-500'
              : 'text-green-500'
          }`}
        >
          {percentage} %
        </p>
        
        )}
        {/* <span className="w-full">
          {percentage === 0 ||
            (percentage && (
              <div className="w-full h-2 bg-gray-200  dark:bg-gray-500 rounded-full mt-2">
                <div
                  className={`h-2 rounded-full ${getProgressBarColor(
                    parseInt(value ?? 0)
                  )}`}
                  style={{
                    width: `${
                      (value ?? 0) > 100
                        ? "100%"
                        : `${Math.round(parseFloat(value) ?? 0)}%`
                    }`,
                  }}
                ></div>
              </div>
            ))}
        </span> */}
      </div>

      <div className=" text-xl">›</div>
    </div>
  );
}

export default TestReview;
