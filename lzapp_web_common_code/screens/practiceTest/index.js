import React, { useContext, useEffect, useState } from "react";
import { LAText, LAView } from "../../components";
import { useNavigate } from "react-router-dom";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { STRINGS } from "../../constant";
import IconTint from "react-icon-tint";
import { GET_PRACTICE_TEST } from "../../../app_constant";
import { BundleContext } from "../../context/BundleProvider";
import { AuthContext } from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import BackArrowIcon from "../../components/BackArrowIcon";
import PracticeTestDialog from "../../components/PracticeTestDialog";
import moment from "moment";

const PracticeTest = () => {
  const { isSubscribe, profile, questionsList, community } = useContext(AuthContext);
  const { selectedCertificate } = useContext(BundleContext);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const { theme, currentTheme } = useContext(ThemeContext);
  const PRACTICE_TEST = GET_PRACTICE_TEST(selectedCertificate);
  const navigation = useNavigate();
  /* function onStartTest(item) {
    console.log("item", item);
     if (item.requires_subscription) {
      if (isSubscribe) {
        localStorage.setItem("testStart", JSON.stringify(true));
        navigation("/test", { state: item });
      } else {
        navigation("/chooseplan");
      }
    } else {
      localStorage.setItem("testStart", JSON.stringify(true));
      navigation("/test", { state: item });
    } 
  } */
  const handleTestClick = (item) => {

    const filterQuestions = (questionsList ?? []).filter(
      (question) => question?.practice_test_id === item?.practice_test_id
    );
    const num_questions = filterQuestions.length;
              
    const questionTime = profile?.time_per_question
      ? profile?.time_per_question
      : community?.total_time_per_question ?? 90;

    let test_time = questionTime * num_questions;
    item.test_time = test_time;
    item.is_custom_test = false;
    item.num_questions = num_questions;
    setSelectedTest(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTest(null);
  };

  const handleTestStart = () => {
    localStorage.setItem("testStart", JSON.stringify(true));
    setIsDialogOpen(false);
    navigation("/test", { state: selectedTest });
  };

  const handleChoosePlan = () => {
    setIsDialogOpen(false);
    navigation("/chooseplan");
  };

  function onBack() {
    navigation(-1);
  }
  return (
    <>
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation("/home");
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
            title={STRINGS.practice_test}
          />
        </LAView>
      </LAView>

      
        {/* <LAView className="col-span-12 md:col-span-6 h-full">
          <LAView className="relative w-full  rounded-lg">
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-contain"
                src={SVG_IMAGES?.PracticeTestBG}
              />
              <div className="absolute flex h-full pt-8 pl-8  gap-2 items-center justify-between top-0 left-0 w-full ">
                <p className="text-white text-xl font-semibold">
                  Confidence, Belief & Practice that’s all you need to crack
                  anything in life.
                </p>
                <img
                  className="w-full h-full object-contain"
                  src={SVG_IMAGES?.PracticeTestArt}
                />
              </div>
            </div>
          </LAView>
        </LAView> */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 px-12 mt-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 px-6 overflow-y-auto  border border-gray-200 dark:border-gray-500 rounded-2xl p-6">
          {PRACTICE_TEST?.map((practiceSet, index) => (

            <HistoryItem
              key={index}
              title={practiceSet.test_name}
              question={practiceSet.num_questions}
              testItem={practiceSet}
              isCustomTest={false}
              reqSub={practiceSet?.requires_subscription}
              onClick={() => {
                handleTestClick(practiceSet);
              }}
            />

          ))}
        </div>



        {selectedTest && (
          <PracticeTestDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onStart={handleTestStart}
            onChoosePlan={handleChoosePlan}
            testDetails={selectedTest}
            isSubscribe={isSubscribe}
          />
        )}
      </div>
    </>
  );
};

function HistoryItem(props) {
  const { isSubscribe, questionsList, profile } = useContext(AuthContext);
  let item = props.testItem;

  const [totalCount, setQuestionCount] = useState(0);
  useEffect(() => {
    getQuestionCount();
  }, []);

  async function getQuestionCount() {
    const filterQuestions = (questionsList ?? []).filter(
      (question) => question?.practice_test_id === item?.practice_test_id
    );

    setQuestionCount(filterQuestions.length);
  }
  function getLatestDateOfTest() {
    const tests = (profile?.practice_test_history ?? []).filter(
      (e) => e.test_name == item.test_name
    );
    if (tests?.length > 0) {
      const dates = tests.map((e) => moment(e.date, "MMM, DD YYYY"));
      return moment.max(dates).format("MMM, DD YYYY");
    }

    return null;
  }

  const latestDate = getLatestDateOfTest();

  return (
    <LAView
      key={props.key}
      flex="row"
      onClick={props.onClick}
      className="flex text-lg text-black dark:text-white items-center w-full p-4 mt-4 cursor-pointer rounded-lg bg-lz-blue-1 dark:bg-lz-blue-7 shadow-md transition-colors duration-300 hover:bg-lz-blue-3 dark:hover:bg-lz-blue-10"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-lz-blue-5 text-white">
        <img
          className="filter brightness-0"
          src={SVG_IMAGES.ic_practice_test}
          alt="Test Icon"
        />
      </div>
      <div className="flex-1 mx-3">
        <div className="font-medium">{props.title} </div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {`${totalCount} Questions`}
        </div>
        {latestDate ? (
          <p className="text-xs">{`Test last taken on: ${latestDate}`}</p>
        ) : (
          <p className="text-xs">{`Test not yet taken`}</p>
        )}
      </div>

      {props.reqSub ? (
        <>
          {isSubscribe ? (
            <div className="text-xl">›</div>
          ) : (
            <img src={SVG_IMAGES.Lock} />
          )}
        </>
      ) : (
        <div className="text-xl">›</div>
      )}

      {/* {props?.reqSub ? (
        <LAText size="small" font="600" color={"black"} title={"❯"} />
      ) : (
        <img src={SVG_IMAGES?.Lock} />
      )} */}
    </LAView>
  );
}

export default PracticeTest;
