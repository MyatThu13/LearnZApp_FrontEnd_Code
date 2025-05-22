//PACKAGES
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

//CONSTANTS & ASSETS
import { STRINGS } from "../constant";
import { IMAGES } from "../assets";

//COMPONENTS
import { Header, LAView, LAText, LATextInput, LAButton } from "../components";

//PACKAGES
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import IconTint from "react-icon-tint";

// API
import { GET_OTHER_APPS } from "../api/firebase_user";
import BackArrowIcon from "../components/BackArrowIcon";
import { ThemeContext } from "../context/ThemeProvider";

function OtherApps() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);
  const { theme, currentTheme } = useContext(ThemeContext);

  const navigation = useNavigate();

  const percentage = 66;

  useEffect(() => {
    getOtherApps();
  }, []);

  async function getOtherApps() {
    const result = await GET_OTHER_APPS();
    setLoading(false);

    if (result.status) {
      setApps(result?.data ?? []);
      setError("");
    } else {
      setError(result.error);
    }
  }

  return (
    <>
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation(-1);
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
            title={STRINGS.other_app}
          />
        </LAView>
      </LAView>
      {/* <LAView className="grid grid-cols-12 gap-[24px] px-[24px] mt-[24px]">
         <LAView className="col-span-12 md:col-span-6 h-full">
          <LAView className="relative w-full rounded-lg">
            <img src={IMAGES.other_app} />
            <LAView
              type="center"
              className="absolute z-[50]  top-0 bottom-0 left-0 right-0"
            >
              <LAText
                className="ml-2 mr-[40%]"
                size="medium"
                font="600"
                color={"white"}
                title={STRINGS.other_app_message}
              />
            </LAView>
          </LAView>
        </LAView> */}
        <div className="m-20 col-span-12 md:col-span-6">
        <h1 className="text-2xl font-semibold text-center mb-6 text-lz-blue">Discover Our Comprehensive Exam Prep Apps</h1>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 ">
    {apps?.map((e, index) => {
      return (
        <a
          className="w-full h-auto"
          key={e?.id}
          href={e?.webpage}
          target="__blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-xl  hover:shadow-xl transition-shadow duration-300 border-2">
            <img
              className="w-24 h-24 object-contain mb-2 rounded-lg"
              src={e?.image}
              alt={e?.title}
            />
            <div className="text-center font-semibold text-gray-800 dark:text-gray-200">
              {e?.title}
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {e?.subTitle}
            </div>
          </div>
        </a>
      );
    })}
  </div>
</div>

      {/* </LAView> */}
    </>
  );
}

export default OtherApps;
