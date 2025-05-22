import { useContext, useState } from "react";

//CONSTANTS & ASSETS
import { STRINGS } from "../constant";
import { IMAGES } from "../assets";

//COMPONENTS
import { Header, LAView, LAText } from "../components";

//PACKAGES
import { useNavigate } from "react-router-dom";
import IconTint from "react-icon-tint";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { AuthContext } from "../context/AuthProvider";
import BackArrowIcon from "../components/BackArrowIcon";
import { ThemeContext } from "../context/ThemeProvider";
import { SHOW_TOAST } from "../constant/utils";

function TestSetting() {
  const { bundleData, profile, community, setTestOptions, setFontsOptions } =
    useContext(AuthContext);
  const initialTime = profile?.time_per_question
    ? profile?.time_per_question
    : community?.total_time_per_question ?? [60, 90];
  const intialGoback = profile?.allow_go_back ?? true;

  const [isGoback, setGoback] = useState(intialGoback);
  const [time, setTime] = useState(initialTime);
  const [isChecked, setIsChecked] = useState(false);
  const { currentTheme } = useContext(ThemeContext);

  const navigation = useNavigate();

  const showRangeValue = (e) => {
    setTime(e[1]);
  };

  const prevQuestionSetting = (e) => {
    //setTestOptions(time, e.target.checked);
    //setIsChecked(e.target.checked);
    setGoback(e.target.checked);
  };

  const handleSave = () => {
    setTestOptions(time, isGoback);
    SHOW_TOAST("Test Options Updated.", "success");
    navigation(-1);
  };
  
  return (
    <LAView>
      {/* <Header onChange={() => {

            }} onProfile={() => {

            }} /> */}
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
            title={"Settings"}
          />
          <LAText
            className="flex line-clamp-1 truncate"
            size="small"
            font="600"
            color={"gray"}
            title={"Test Options"}
          />
        </LAView>
      </LAView>
      <LAView flex="col" className="flex px-[24px]">
        <LAText
          className="mt-7"
          size="regular"
          font="400"
          color={"black"}
          title={`Time per Question (${time[1] || time} seconds)`}
        />
        <LAView className="mt-[20px] md:w-[50%]">
          <RangeSlider
            onInput={(e) => showRangeValue(e)}
            className="single-thumb"
            // defaultValue={[60, 90]}
            value={(time && [60, time]) || [60, time]}
            min="60"
            max="300"
            thumbsDisabled={[true, false]}
            rangeSlideDisabled={true}
          />
        </LAView>
        <LAView flex="row" className="mt-[30px] w-[50%] flex justify-between">
          <LAText
            size="regular"
            font="400"
            color={"black"}
            title={"Allow go back to previous Questions?"}
          />

          <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input
              type="checkbox"
              name="check"
              checked={isGoback}
              onChange={prevQuestionSetting}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full  after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white   after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#05C46B]"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
          </label>
        </LAView>
        <div className="w-1/2 mt-10 flex justify-end">
        <button
          onClick={handleSave}
          className="py-2 px-4 bg-lz-blue text-white rounded-lg hover:bg-lz-blue-3 transition"
        >
          Save
        </button>
      </div>  
      </LAView>
    </LAView>
  );
}

export default TestSetting;
