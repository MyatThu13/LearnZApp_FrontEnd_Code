import React, { useContext, useState } from "react";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { STRING, STRINGS } from "../../constant";
import { LAButton, LAText, LATextInput, LAView } from "../../components";
import IconTint from "react-icon-tint";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { BundleContext } from "../../context/BundleProvider";
import { GET_APP_DOMAIN_LIST } from "../../../app_constant";
import { QUESTION_PRIORITY, SHOW_TOAST } from "../../constant/utils";
import BackArrowIcon from "../../components/BackArrowIcon";
import { ThemeContext } from "../../context/ThemeProvider";
import { MixpanelContext } from "../../context/MixpanelProvider";
import PracticeTestDialog from "../../components/PracticeTestDialog";

const CustomTestBuilder = () => {
  const navigation = useNavigate();

  const { isSubscribe, profile, community } = useContext(AuthContext);
  const { selectedCertificate } = useContext(BundleContext);
  const { trackCustomTest } = useContext(MixpanelContext);
  const { theme, currentTheme, getThemeName } = useContext(ThemeContext);

  const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
  const [selectedDomains, setSelectedDomains] = useState(APP_DOMAIN_LIST);
  const [numberOfQuestion, setNumberOfQuestion] = useState(5);
  const [timeAmount, setTimeAmount] = useState(0);
  const [isVisibleDomain, setIsVisibleDomain] = useState(true);
  const [priority, setPriority] = useState(STRING.default);
  const [isShowAnswer, setShowAnswer] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [testDetails, setTestDetails] = useState(null);

  function onStart() {
    if (isSubscribe == false && (numberOfQuestion > 5 || timeAmount > 0)) {
      navigation("/chooseplan");
    } else if (selectedDomains.length > 0) {
      const domain_ids = selectedDomains.map((e) => e.id);
      const domain_names = selectedDomains.map((e) => e.domain_name);

      trackCustomTest(
        domain_ids,
        domain_names,
        numberOfQuestion,
        timeAmount,
        isShowAnswer,
        priority
      );
      const questionTime = profile?.time_per_question
      ? profile?.time_per_question
      : community?.total_time_per_question ?? 90;
    
      let test_time = questionTime * numberOfQuestion;
    

      const item = {
        test_name: "Custom Test",
        num_questions: numberOfQuestion,
        test_time: test_time,
        total_time: timeAmount,
        topic_ids: domain_ids,
        is_custom_test: true,
        is_show_answer: isShowAnswer,
        priority: priority,
      };
      setTestDetails(item);
      setIsDialogOpen(true);
      //navigation("/test", { state: item });
    } else {
      SHOW_TOAST("Please select domains");
    }
  }
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleTestStart = () => {
    trackCustomTest(
      testDetails.topic_ids,
      testDetails.domains,
      testDetails.num_questions,
      testDetails.total_time,
      testDetails.is_show_answer,
      testDetails.priority
    );

    setIsDialogOpen(false);
    navigation("/test", { state: testDetails });
  };

  const handleChoosePlan = () => {
    setIsDialogOpen(false);
    navigation("/chooseplan");
  };


  function onSelectItem(item, isSelected) {
    if (isSelected) {
      const array = selectedDomains?.filter((e) => e.id != item.id);
      setSelectedDomains(array);
    } else {
      const array = [...selectedDomains];
      array.push(item);
      setSelectedDomains(array);
    }
  }

  function onAllSelection(isSelected) {
    if (isSelected) {
      setSelectedDomains([]);
    } else {
      setSelectedDomains(APP_DOMAIN_LIST);
    }
  }

  function getScoreOfTopic(id) {
    const scores = profile?.readiness_scores?.topic_progress ?? [];
    const topics = scores.filter((e) => e.domain_id == id);
    if (topics.length > 0) {
      const value = topics[0]?.readiness_score ?? "0";
      const intValue = parseInt(value);
      if (intValue >= 70) {
        return theme.COLOR_GREEN;
      } else if (intValue < 40) {
        return theme.COLOR_RED;
      } else {
        return theme.COLOR_YELLOW;
      }
    }
    return theme.COLOR_RED;
  }

  const domains_ids = APP_DOMAIN_LIST?.map((e) => e.id);
  const selected_ids = selectedDomains?.map((e) => e.id);
  const isSelected = domains_ids.length == selected_ids.length;

  return (
    <>
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation('/');
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
            title={STRINGS.custom_test_builder}
          />
        </LAView>
      </LAView>

      <LAView className="mb-4 grid grid-cols-12 gap-[24px] px-[24px] mt-[24px]">
        <LAView className="col-span-12 md:col-span-6 h-full">
          <LAView
            flex="col"
            className="flex md:overflow-y-auto md:h-[75vh] lg:h-[85vh] md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] p-2 sm:p-2 md:p-[18px] lg:p-[18px]"
          >
            <div className="">
              <div
                onClick={() => setIsVisibleDomain(!isVisibleDomain)}
                className="w-full cursor-pointer"
              >
                <div className="flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4 bg-[#F6FAFF] dark:bg-[#222] items-center  flex-row">
                  <div className=" bg-transparent  w-full  font-manrope-400 text-[#000] dark:text-[#fff] text-[#ADBACC] dark:text-[#ffffff80] outline-none  border-none  focus:ring-0">
                    {`Select Domains (${selectedDomains?.length})`}{" "}
                  </div>
                </div>
              </div>
              {isVisibleDomain && (
                <div className="domain-check mt-4">
                  <label
                    key={"23"}
                    htmlFor={"all"}
                    onClick={() => onAllSelection(isSelected)}
                    className="relative flex items-center gap-4 mb-4 w-fit"
                  >
                    <div className="w-5 h-5">
                      <div className="w-full h-full rounded-md ">
                        {isSelected ? (
                          <img src={IMAGES?.ic_check} />
                        ) : (
                          <div className="w-full h-full rounded-md border-2"></div>
                        )}
                      </div>
                    </div>

                    <input
                      defaultChecked
                      id={"877"}
                      name={"all"}
                      type="checkbox"
                      className="hidden"
                    />
                    <span className="text-gray-800 dark:text-gray-300 lg:text-base md:text-base sm:text-sm text-sm font-semibold">
                      All Domains
                    </span>
                  </label>

                  {APP_DOMAIN_LIST?.map((item, idx) => {
                    const isSelected =
                      selectedDomains.filter((e) => e.id == item.id).length > 0;
                    const value = getScoreOfTopic(item.id);
                    return (
                      <label
                        key={item?.id + idx}
                        htmlFor={item?.id}
                        // onClick={}
                        className="text-gray-800 dark:text-gray-300 relative flex items-center gap-4 mb-4 w-fit"
                      >
                        <div className="w-5 h-5">
                          {isSelected ? (
                            <div className="w-full h-full rounded-md ">
                              <img src={IMAGES?.ic_check} />
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-md border-2"></div>
                          )}
                        </div>

                        <input
                          onChange={() => onSelectItem(item, isSelected)}
                          defaultChecked={item?.defaultCheck}
                          id={item?.id}
                          name={item?.id}
                          type="checkbox"
                          className="hidden"
                        />
                        <span className="lg:text-base md:text-base sm:text-sm text-sm font-semibold">
                          {item?.domain_name}
                        </span>
                        <div
                          style={{ backgroundColor: value }}
                          className={`h-2  w-2 rounded-full`}
                        ></div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </LAView>
        </LAView>

        <LAView className="col-span-12 md:col-span-6 gap-[24px] flex-col items-center">
          <LAView
            flex="col"
            className="flex md:overflow-y-auto h-auto md:h-auto lg:h-auto md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] p-2 sm:p-2 md:p-[18px] lg:p-[18px]"
          >
            <p className="text-gray-800 dark:text-gray-300 lg:text-lg md:text-lg sm:text-base text-base font-semibold mb-4">
              Number of Questions
            </p>
            <div className="no-of-questions grid grid-rows-1 grid-flow-col gap-2 items-center justify-between">
              {[5, 10, 25, 50, 100].map((ele, idx) => {
                return (
                  <button
                    onClick={() => {
                      setTimeAmount(0);
                      setNumberOfQuestion(ele);
                    }}
                    key={idx}
                    style={{
                      backgroundColor:
                        ele === numberOfQuestion
                          ? getThemeName() == "light"
                            ? theme.COLOR_GREEN
                            : theme.COLOR_GREEN
                          : theme.THEME_SEPERATER,
                    }}
                    className={`relative lg:h-14 lg:w-14 md:h-14 md:w-14 sm:w-10 sm:h-10 w-10 h-10 
                 
                    }  rounded-xl flex items-center justify-center`}
                  >
                    {ele > 5 && isSubscribe == false && (
                      <div className="absolute top-1 right-1">
                        <IconTint
                          className="h-3 w-3"
                          color={theme?.THEME_TEXT_BLACK_LIGHT}
                          src={SVG_IMAGES?.Lock}
                        />
                      </div>
                    )}
                    <span
                      style={{ color: theme?.THEME_TEXT_BLACK_LIGHT }}
                      className="text-white text-xs sm:text-xs lg:text-sm md:text-sm font-bold"
                    >
                      {ele}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-gray-800 dark:text-gray-300 flex items-center justify-between gap-2 w-full">
              <div className="border-b border-dashed my-8 relative w-full"></div>
              <span>Or</span>
              <div className="border-b border-dashed my-8 relative w-full"></div>
            </div>

            <p className="text-gray-800 dark:text-gray-300 lg:text-lg md:text-lg sm:text-base text-base font-semibold mb-4">
              Time (in minutes)
            </p>
            <div className="no-of-questions grid grid-rows-1 grid-flow-col gap-2 items-center justify-between">
              {[5, 10, 20, 30, 60].map((ele, idx) => {
                return (
                  <button
                    onClick={() => {
                      setNumberOfQuestion(0);
                      setTimeAmount(ele);
                    }}
                    key={idx}
                    style={{
                      backgroundColor:
                        ele === timeAmount
                          ? getThemeName() == "light"
                            ? theme.COLOR_GREEN
                            : theme.COLOR_GREEN
                          : theme.THEME_SEPERATER,
                    }}
                    className={`relative lg:h-14 lg:w-14 md:h-14 md:w-14 sm:w-10 sm:h-10 w-10 h-10   rounded-xl flex items-center justify-center`}
                  >
                    {isSubscribe == false && (
                      <div className="absolute top-1 right-1">
                        <IconTint
                          className="h-3 w-3"
                          color={theme?.THEME_TEXT_BLACK_LIGHT}
                          src={SVG_IMAGES?.Lock}
                        />
                      </div>
                    )}
                    <span
                      style={{ color: theme?.THEME_TEXT_BLACK_LIGHT }}
                      className="text-white text-xs sm:text-xs lg:text-sm md:text-sm font-bold"
                    >
                      {ele}
                    </span>
                  </button>
                );
              })}
            </div>
          </LAView>
          <div className="mt-3 md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.27)] md:rounded-xl md:border-[1px] p-2 sm:p-2 md:p-[18px] lg:p-[18px]">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-gray-800 dark:text-gray-300 text-sm sm:text-sm  md:text-base lg:font-base font-semibold">
                Show answer as I go
              </h4>
              <label
                htmlFor="isshow"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  onChange={(event) => {
                    const value = event.target.checked;
                    setShowAnswer(value);
                  }}
                  name="isshow"
                  id="isshow"
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 outline-none"></div>
              </label>
            </div>
          </div>

          <div className="mt-3 md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-xl md:border-[1px] p-2 sm:p-2 md:p-[18px] lg:p-[18px]">
            <p className="text-gray-800 dark:text-gray-300 text-lg font-semibold mb-4">
              Which Questions to Prioritize?
            </p>

            {QUESTION_PRIORITY?.map((ele, idx) => {
              const isChecked = ele.key === priority;

              return (
                <label
                  key={idx}
                  htmlFor={`priority-${idx}`}
                  className="flex items-center gap-4 mb-4 w-fit"
                  style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
                >
                  {/* <div
                    className={`h-6 w-6 border-2 rounded-md flex items-center justify-center ${
                      isChecked ? "bg-[#fff]" : ""
                    }`}
                  >
                    {isChecked && (
                      <div
                        style={{ backgroundColor: theme?.THEME_SEPERATER }}
                        className={`p-[7px] rounded-sm  m-3 bg-[${theme?.THEME_SEPERATER}]`}
                      ></div>
                    )}
                  </div> */}
                  <div className="w-5 h-5">
                          {isChecked ? (
                            <div className="w-full h-full rounded-md ">
                              <img src={IMAGES?.ic_check} />
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-md border-2"></div>
                          )}
                        </div>

                  <input
                    id={`priority-${idx}`}
                    name="priority"
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setPriority(ele.key)}
                    className="hidden"
                  />
                  <span className="text-gray-800 dark:text-gray-300 text-base font-medium">
                    {ele?.title}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-center items-center py-6 w-1/2 mx-auto gap-2 flex-col">
            <button
              className="w-3/4 py-4 px-4 text-white bg-lz-blue hover:bg-lz-orange rounded-xl"
              onClick={onStart}
            >
              {(numberOfQuestion > 5 || timeAmount > 0) && isSubscribe == false
                ? STRING.subscribe_and_continue
                : STRING.get_started}
            </button>
          </div>

        </LAView>
        {testDetails && (
        <PracticeTestDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onStart={handleTestStart}
          onChoosePlan={handleChoosePlan}
          testDetails={testDetails}
          isSubscribe={isSubscribe}
        />
      )}
      </LAView>
    </>
  );
};

export default CustomTestBuilder;
