//PACKAGES
import { useNavigate } from "react-router-dom";

//CONSTANTS
import { STRING, STRINGS } from "../constant";

//COMPONENTS
import { Header, SpeedoMeter, LAView, LAText, Chart } from "../components";

//PACKAGES
import _ from "lodash";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AuthContext } from "../context/AuthProvider";
import { IMAGES, SVG_IMAGES } from "../assets";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { MixpanelContext } from "../context/MixpanelProvider";

import BackArrowIcon from "../components/BackArrowIcon";

function History() {
  const navigation = useNavigate();
  const { profile } = useContext(AuthContext);
  const { trackHistory } = useContext(MixpanelContext);
  const { theme, currentTheme } = useContext(ThemeContext);

  const [error, setError] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [totalTest, setTotalTest] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    trackHistory();

    const array = profile?.practice_test_history ?? [];
    setTotalTest(array.length);

    const correctArray = array.map((e) => parseInt(e?.correct ?? 0));
    const totalCorrect = _.sum(correctArray);

    const totalQuestionArray = array.map((e) => parseInt(e?.total ?? 0));
    const totalQuestions = _.sum(totalQuestionArray);

    const scoresArray = array.map((e) => parseInt(e?.score ?? 0));
    const totalScore = _.sum(scoresArray);
    let avg = parseInt((totalCorrect / totalQuestions) * 100) ?? 0;
    avg = isNaN(avg) ? 0 : avg;
    setAvgScore(avg);

    const groupping = _.chain(array)
      .groupBy("date")
      .map((value, key) => ({ title: key, data: value.reverse() }))
      .value();
    const message = array.length == 0 ? STRING.no_record_test_histoy : "";
    setError(message);
    setHistoryData(groupping.reverse());
  }, [profile]);

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
              title={STRING?.test_history}
            />
          </LAView>
        </LAView>
      
      {historyData.length > 0 && (
        <LAView className="grid grid-cols-12 gap-[24px] px-[24px]">
          <LAView className="col-span-12 md:col-span-6 h-full">
          <div className="bg-lz-blue-4 dark:bg-lz-blue-10 rounded-2xl flex flex-col items-center justify-center mt-10">
              <div className="w-1/2 h-1/2 mt-10">
                <CircularProgressbar
                  value={avgScore}
                  text={`${avgScore}%`}
                  circleRatio={0.75}
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    pathColor: theme.COLOR_LZ_BLUE_6, 
                    textColor: theme.THEME_TEXT_BLACK, 
                    textSize: '1.1rem',
                    backgroundColor: theme.COLOR_LZ_BLUE_2,
                    trailColor: theme.COLOR_LZ_BLUE_1,
                    rotation: 1 / 2 + 1 / 8,
                  })}
                />
              </div>
              <span className="mb-10 text font-normal text-black dark:text-gray-100">
                {STRINGS.overall_average_score}
              </span>
            </div>
          </LAView>
          <LAView className="col-span-12 md:col-span-6 gap-[24px]">
            <LAView
              flex="col"
              className="flex md:overflow-y-auto md:h-[75vh] md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] md:px-[24px] md:pb-[24px]"
            >
              {historyData.length > 0 &&
                historyData?.map((e, idx) => {
                  return (
                    <div key={idx}>
                      <LAText
                        key={idx}
                        className="mt-[24px]"
                        size="medium"
                        font="400"
                        color={"black"}
                        title={e?.title}
                      />
                      {e?.data?.map((e, index) => {
                        return (
                          <HistoryItem
                            data={e}
                            key={index + "0"}
                            onClick={() => {
                              /* navigation("/testReview", {
                                state: e,
                                canGoBackKey: false,
                              }); */
                              navigation("/testReview", { state: { historyData: e, canGoBackKey: false } });
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
            </LAView>
          </LAView>
        </LAView>
      )}
      {error && (
        <div className=" flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img className="w-12 h-auto" src={IMAGES.ic_tab_hisotry} />
            <LAText
              className="mb-4 flex items-center justify-center line-clamp-1 truncate px-[24px] text-center break-normal "
              size="small"
              font="400"
              color={"gray"}
              title={error}
            />
          </div>
        </div>
      )}

      {/* </LAView> */}
    </>
  );
}

function HistoryItem(props) {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      key={props.data?.test_name}
      onClick={props.onClick}
      className="flex text-lg text-black dark:text-white items-center w-full p-4 mt-4 cursor-pointer rounded-lg bg-lz-blue-1 dark:bg-lz-blue-9 shadow-md transition-colors duration-300 hover:bg-lz-blue-3 dark:hover:bg-lz-blue-10"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-lz-blue-5 text-white">
        <img
          className="filter brightness-0"
          src={SVG_IMAGES.ic_practice_test}
          alt="Test Icon"
        />
      </div>
      <div className="flex-1 mx-3">
        <div className="font-medium">
          {props.data?.test_name}
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          Questions: {props.data?.total}, Score: {props.data?.score}%
        </div>
      </div>
      <div className="text-xl">›</div>
    </div>
  );
}

export default History;
