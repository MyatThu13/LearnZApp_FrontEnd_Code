import { useContext, useEffect, useState } from "react";

//PACKAGES
import { useNavigate } from "react-router-dom";
import moment from "moment";

//CONSTANTS
import { STRING, STRINGS } from "../constant";

//COMPONENTS
import { Header, SpeedoMeter, LAView, LAText, Chart } from "../components";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";
import { MixpanelContext } from "../context/MixpanelProvider";

function Dashboard() {
  const { profile } = useContext(AuthContext);
  const navigation = useNavigate();
  const { trackDashboard } = useContext(MixpanelContext);
  const { theme } = useContext(ThemeContext);
  const [score, setScore] = useState(null);

  useEffect(() => {
    trackDashboard();

    setScore(profile?.readiness_scores);
  }, [profile?.readiness_scores]);

  const scores = profile?.score_progress ?? {};
  let keys = Object.keys(scores);

  const getProgressBarColor = (readinessScore) => {
    if (readinessScore < 25) return "bg-red-500";
    if (readinessScore >= 25 && readinessScore <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  function getChartData() {
    keys.sort(
      (a, b) =>
        moment(a, "YYYY-MM-DD").toDate().getTime() -
        moment(b, "YYYY-MM-DD").toDate().getTime()
    );

    if (keys.length > 6) {
      keys = keys.slice(keys.length - 6, keys.length);
    }

    let labels = keys.length < 6 ? [""] : [];
    let data = keys.length < 6 ? [0] : [];
    for (var index in keys) {
      if (index <= 5) {
        const key = keys[index];
        labels.push(moment(key, "YYYY-MM-DD").format("DD MMM"));

        const score = scores[key];
        if (isNaN(score) || !isFinite(score)) {
          if (data.length > 0) {
            data.push(data[data.length - 1]);
          } else {
            data.push(0);
          }
        } else {
          data.push(parseInt(score));
        }
      }
    }

    const chartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          borderColor: theme?.THEME_DARK,
          backgroundColor: theme?.THEME_DARK,
        },
        {
          data: [0],
          withDots: false,
        },
        {
          data: [100],
          withDots: false,
        },
      ],
    };

    return chartData;
  }

  const chartData = getChartData();
  return (
    <>
      {/* <LAView>
             <Header
                onChange={() => {

                }} onProfile={() => {

                }} /> */}
      <LAView className="grid grid-cols-12 gap-[24px] px-[24px]">
        <LAView className="col-span-12 md:col-span-6">
          <LAView
            className={`"h-auto 
                        sm:h-auto 
                        p-[12px]
                        md:p-auto
                        bg-[${theme?.THEME_DARK}] 
                        rounded-[20px]`}
            flex="row"
            styles={{
              background: `${theme?.THEME_DARK}`,
            }}
          >
            <LAView type="full-element-center" flex="row">
              <SpeedoMeter data={score} question={profile?.readiness_scores} />
            </LAView>
          </LAView>
          <h2 className="mb-4 mt-10 text-lg font-semibold text-black dark:text-gray-300">
            {STRINGS.readiness_progress_history}
          </h2>

          {profile?.score_progress ? (
            <div className="bg-gray-50 dark:bg-gray-100 p-10 rounded-xl hidden md:flex w-full">
              <Chart data={chartData} />
            </div>
          ) : (
            <LAText
              className="mb-4 hidden md:flex line-clamp-1 truncate my-10"
              size="normal"
              font="400"
              color={theme.TAABAR_UNSELECTED_COLOR}
              title={STRINGS.domain_readiness_score_empty}
            />
          )}
        </LAView>
        <LAView className="col-span-12 md:col-span-6 gap-[24px]">
          <div className="w-full overflow-visible">
            <h2 className="m-4 text-lg font-semibold text-black dark:text-gray-300">
              {STRINGS.domain_readiness_score}
            </h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-10 rounded-xl">
              {(score?.topic_progress ?? []).length > 0 &&
                score?.topic_progress?.map((e, index) => (
                  <div key={index} className="mb-10">
                    <div className="flex justify-between items-center">
                      <span className="flex-1 truncate overflow-hidden mr-2 text-sm font-medium text-black dark:text-gray-300">
                        {e?.domain_name}
                      </span>
                      <span className="text-sm font-medium text-black dark:text-gray-300">
                        {(e?.readiness_score ?? 0) > 100
                          ? "100%"
                          : `${Math.round(
                              parseFloat(e?.readiness_score) ?? 0
                            )}%`}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-500 rounded-full mt-2">
                      <div
                        className={`h-2 rounded-full ${getProgressBarColor(
                          parseInt(e?.readiness_score ?? 0)
                        )}`}
                        style={{
                          width: `${
                            (e?.readiness_score ?? 0) > 100
                              ? "100%"
                              : `${Math.round(
                                  parseFloat(e?.readiness_score) ?? 0
                                )}%`
                          }`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>

            {(score?.topic_progress ?? []).length === 0 && (
              <p className="text-sm font-medium text-black dark:text-white">
                {STRINGS.domain_readiness_score_empty}
              </p>
            )}
          </div>

          <LAText
            className={`mb-4 flex md:hidden line-clamp-1 truncate text-[${theme?.THEME_TEXT_BLACK_LIGHT}]`}
            size="medium"
            font="600"
            color={""}
            title={STRINGS.readiness_progress_history}
          />
          <LAView className="flex md:hidden w-full mt-10">
            <Chart />
          </LAView>
        </LAView>
      </LAView>
      {/* </LAView> */}
    </>
  );
}

export default Dashboard;
