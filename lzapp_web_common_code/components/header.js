import { IMAGES } from "../assets";

//COMPONENT
import { LAView } from ".";

//PACKAGES
import IconTint from "react-icon-tint";
import { useContext, useState } from "react";
import ChangeFont from "./popup/ChangeFont";
import { ThemeContext } from "../context/ThemeProvider";
import { GET_APP_NAME_FOR_LOGO } from "../../app_constant";
import { BundleContext } from "../context/BundleProvider";
import HTMLContent from "./HTMLContent";

function Header(props) {
  const [changeFont, setChangeFont] = useState(false);
  const { theme, currentTheme } = useContext(ThemeContext);
  const { selectedCertificate } = useContext(BundleContext);
  const appName = GET_APP_NAME_FOR_LOGO(selectedCertificate);

  return (
    <div className="flex sticky top-0 z-[500]  px-4 lg:px-8 sm:px-2 py-4 border-b-2 border-gray-200 dark:border-gray-600 grid grid-cols-2 gap-4 bg-white dark:bg-black">
      {/* First Column */}
      <div className="flex flex-col justify-start items-start">
        {/* Image Row */}
        <img
          className="w-[25%] h-auto md:w-[20%] lg:w-[16%]"
          src={IMAGES.logo_prepare}
          alt="logo"
        />
        {/* Text Row */}
        <HTMLContent htmlContent={appName} className="text-sm mt-2" />
      </div>

      {/* Second Column */}
      <div className="flex justify-end items-center space-x-10">
        {/* Icons Row */}
        {props.onThemeChange && (
          <div className="text-center"> 
          <button
            className="rounded-lg border-2 dark:border-gray-600 px-1 py-1"
            onClick={props.onThemeChange}
          >
            <img
              className="p-2 h-[20px] md:h-[30px] w-[20px] md:w-[30px] rounded-lg"
              src={currentTheme === "light" ? IMAGES.ic_dark_mode : IMAGES.ic_light_mode}
              alt="themechange"
              style={{ background: `${theme?.COLOR_LZ_BLUE}` }}
            />
            
          </button>
          <div className="mt-1 text-xs" style={{ color: currentTheme === "dark" ? 'white' : 'inherit' }}> 
          {currentTheme === "light" ? "Dark Mode" : "Light Mode"}
          </div>
        </div>
        
        )}
        {props.onChange && (
          <div className="text-center"> 
          <button
            className="rounded-lg border-2  dark:border-gray-600 px-1 py-1"
            onClick={props.onChange}
          >
            <img
              className="p-2 h-[20px] md:h-[30px] w-[20px] md:w-[30px] rounded-lg"
              src={IMAGES.change}
              alt="switchcertificate"
              style={{ background: `${theme?.COLOR_LZ_BLUE}` }}
            />
          </button>
          <div className="mt-1 text-xs" style={{ color: currentTheme === "dark" ? 'white' : 'inherit' }}> 
          Switch Exam
          </div>
        </div>
        )}
        {props.onProfile && (
          <div className="text-center"> 
          <button
            className="rounded-lg border-2  dark:border-gray-600 px-1 py-1"
            onClick={props.onProfile}
          >
            <img
              alt="profileIcon"
              className="p-2 h-[20px] md:h-[30px] w-[20px] md:w-[30px] text-red-500  rounded-lg"
              src={IMAGES.ic_user_home}
              style={{ background: `${theme?.COLOR_LZ_BLUE}` }}
            />
          </button>
          <div className="mt-1 text-xs" style={{ color: currentTheme === "dark" ? 'white' : 'inherit' }}> 
          Profile
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

export default Header;
