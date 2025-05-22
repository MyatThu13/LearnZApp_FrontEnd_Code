import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../header";
import Tabbar from "../../screens/tabbar";
import LAWarningPopup from "../LAWarningPopup";
import { STRINGS } from "../../constant";
import ChangeExam from "../popup/ChangeExam";
import ChangeFont from "../popup/ChangeFont";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { ThemeContext } from "../../context/ThemeProvider";
import { USER_DEAFULT_KEY } from "../../constant/event";
import Preapare from "./Preapare";
import { BundleContext } from "../../context/BundleProvider";
import { auth } from "../../api/config";

const MainLayout = () => {
  const [layoutState, setLayoutState] = useState({
    isReset: false,
    changeFont: false,
  });
  const { selectedCertificate } = useContext(BundleContext);
  const { theme, currentTheme, setCurrentTheme } = useContext(ThemeContext);

  const [showPreaperScreen, setShowPreapareScreen] = useState(false);

  const location = useLocation();
  const history = useNavigate();
  const [isTestPage, setIsTestPage] = useState(false);
  const [isTestExitPopup, setIsTestExitPopup] = useState(false);
  const [navigatePath, setNavigatePath] = useState(null);
  const navigate = useNavigate();
  const [active, setActive] = useState(location?.pathname);
  const [switchPopup, setSwitchPopup] = useState(false);
  useEffect(() => {
    setIsTestPage(location.pathname === "/test");
    setActive(location?.pathname);
  }, [location.pathname]);
  // useEffect(() => {}, [location.pathname]);
  // console.log(theme?.THEME_LIGHT, "theme light color");
  const onToggleTheme = () => {
    const body = document.body;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem("Theme", newTheme);
    setCurrentTheme(newTheme);
    body.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {}, [location]);
  const activecolor = theme?.THEME_LIGHT;
  const sidebarMenu = [
    {
      name: "Home",
      path: "/home",
      active: active === "/home",
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill={active === "/home" ? `${theme?.THEME_LIGHT}` : "#828282"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.39156 6.62058C4.8358 9.20399 3.05792 10.4957 2.35965 12.4037C2.30363 12.5568 2.25325 12.7118 2.2086 12.8686C1.65201 14.8227 2.3311 16.9127 3.68927 21.0927C5.04745 25.2728 5.72654 27.3628 7.3254 28.6165C7.45366 28.7171 7.58557 28.8129 7.72085 28.9038C9.40728 30.037 11.6049 30.037 16 30.037C20.3952 30.037 22.5927 30.037 24.2792 28.9038C24.4144 28.8129 24.5464 28.7171 24.6746 28.6165C26.2735 27.3628 26.9526 25.2728 28.3107 21.0927C29.6689 16.9127 30.348 14.8227 29.7914 12.8686C29.7468 12.7118 29.6964 12.5568 29.6404 12.4037C28.9421 10.4957 27.1642 9.20399 23.6085 6.6206C20.0527 4.03719 18.2748 2.74547 16.2444 2.67099C16.0815 2.66501 15.9185 2.66501 15.7556 2.67099C13.7252 2.74547 11.9473 4.03718 8.39156 6.62058ZM13.3333 22.7594C12.781 22.7594 12.3333 23.2071 12.3333 23.7594C12.3333 24.3117 12.781 24.7594 13.3333 24.7594H18.6667C19.219 24.7594 19.6667 24.3117 19.6667 23.7594C19.6667 23.2071 19.219 22.7594 18.6667 22.7594H13.3333Z"
            fill={active === "/home" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
        </svg>
      ),
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      active: active === "/dashboard",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.333008 4.3335C0.333008 3.09099 0.333008 2.46973 0.535996 1.97967C0.806646 1.32627 1.32578 0.807135 1.97919 0.536484C2.46924 0.333496 3.0905 0.333496 4.33301 0.333496C5.57552 0.333496 6.19677 0.333496 6.68683 0.536484C7.34024 0.807135 7.85937 1.32627 8.13002 1.97967C8.33301 2.46973 8.33301 3.09099 8.33301 4.3335C8.33301 5.57601 8.33301 6.19726 8.13002 6.68732C7.85937 7.34073 7.34024 7.85986 6.68683 8.13051C6.19677 8.3335 5.57552 8.3335 4.33301 8.3335C3.0905 8.3335 2.46924 8.3335 1.97919 8.13051C1.32578 7.85986 0.806646 7.34073 0.535996 6.68732C0.333008 6.19726 0.333008 5.57601 0.333008 4.3335Z"
            fill={active === "/dashboard" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
          <path
            d="M13.6663 4.3335C13.6663 3.09099 13.6663 2.46973 13.8693 1.97967C14.14 1.32627 14.6591 0.807135 15.3125 0.536484C15.8026 0.333496 16.4238 0.333496 17.6663 0.333496C18.9089 0.333496 19.5301 0.333496 20.0202 0.536484C20.6736 0.807135 21.1927 1.32627 21.4634 1.97967C21.6663 2.46973 21.6663 3.09099 21.6663 4.3335C21.6663 5.57601 21.6663 6.19726 21.4634 6.68732C21.1927 7.34073 20.6736 7.85986 20.0202 8.13051C19.5301 8.3335 18.9089 8.3335 17.6663 8.3335C16.4238 8.3335 15.8026 8.3335 15.3125 8.13051C14.6591 7.85986 14.14 7.34073 13.8693 6.68732C13.6663 6.19726 13.6663 5.57601 13.6663 4.3335Z"
            fill={active === "/dashboard" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
          <path
            d="M0.333008 17.6668C0.333008 16.4243 0.333008 15.8031 0.535996 15.313C0.806646 14.6596 1.32578 14.1405 1.97919 13.8698C2.46924 13.6668 3.0905 13.6668 4.33301 13.6668C5.57552 13.6668 6.19677 13.6668 6.68683 13.8698C7.34024 14.1405 7.85937 14.6596 8.13002 15.313C8.33301 15.8031 8.33301 16.4243 8.33301 17.6668C8.33301 18.9093 8.33301 19.5306 8.13002 20.0207C7.85937 20.6741 7.34024 21.1932 6.68683 21.4638C6.19677 21.6668 5.57552 21.6668 4.33301 21.6668C3.0905 21.6668 2.46924 21.6668 1.97919 21.4638C1.32578 21.1932 0.806646 20.6741 0.535996 20.0207C0.333008 19.5306 0.333008 18.9093 0.333008 17.6668Z"
            fill={active === "/dashboard" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
          <path
            d="M13.6663 17.6668C13.6663 16.4243 13.6663 15.8031 13.8693 15.313C14.14 14.6596 14.6591 14.1405 15.3125 13.8698C15.8026 13.6668 16.4238 13.6668 17.6663 13.6668C18.9089 13.6668 19.5301 13.6668 20.0202 13.8698C20.6736 14.1405 21.1927 14.6596 21.4634 15.313C21.6663 15.8031 21.6663 16.4243 21.6663 17.6668C21.6663 18.9093 21.6663 19.5306 21.4634 20.0207C21.1927 20.6741 20.6736 21.1932 20.0202 21.4638C19.5301 21.6668 18.9089 21.6668 17.6663 21.6668C16.4238 21.6668 15.8026 21.6668 15.3125 21.4638C14.6591 21.1932 14.14 20.6741 13.8693 20.0207C13.6663 19.5306 13.6663 18.9093 13.6663 17.6668Z"
            fill={active === "/dashboard" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
        </svg>
      ),
    },
    {
      name: "History",
      path: "/history",
      active: active === "/history",
      icon: (
        <svg
          width="24"
          height="28"
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.7481 1.93972C2.88829 1.83787 3.03326 1.74416 3.18391 1.65796C3.2323 1.76574 3.30075 1.8667 3.38926 1.95521C5.11 3.67588 6.46066 5.02439 7.65128 5.97732C8.85664 6.94205 9.98545 7.57528 11.286 7.78127C12.0806 7.90712 12.8901 7.90712 13.6847 7.78127C14.9489 7.58104 16.0506 6.97719 17.2183 6.05761C18.3711 5.14977 19.6652 3.8702 21.2942 2.24234C21.3465 2.19011 21.3918 2.13353 21.4301 2.07377C21.9227 2.45751 22.3593 2.9088 22.7268 3.4146C24 5.16704 24 7.66686 24 12.6665V15.3332C24 20.3328 24 22.8326 22.7268 24.5851C22.3156 25.151 21.8179 25.6488 21.2519 26.06C19.4995 27.3332 16.9996 27.3332 12 27.3332C7.00036 27.3332 4.50054 27.3332 2.7481 26.06C2.18213 25.6488 1.68442 25.151 1.27322 24.5851C0 22.8326 0 20.3328 0 15.3332V12.6665C0 7.66686 0 5.16704 1.27322 3.4146C1.68442 2.84864 2.18213 2.35092 2.7481 1.93972ZM6.66667 12.9998C6.11438 12.9998 5.66667 13.4476 5.66667 13.9998C5.66667 14.5521 6.11438 14.9998 6.66667 14.9998H10.6667C11.219 14.9998 11.6667 14.5521 11.6667 13.9998C11.6667 13.4476 11.219 12.9998 10.6667 12.9998H6.66667ZM6.66667 18.3332C6.11438 18.3332 5.66667 18.7809 5.66667 19.3332C5.66667 19.8855 6.11438 20.3332 6.66667 20.3332H17.3333C17.8856 20.3332 18.3333 19.8855 18.3333 19.3332C18.3333 18.7809 17.8856 18.3332 17.3333 18.3332H6.66667Z"
            fill={active === "/history" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
          <path
            d="M12 0.666504C15.5999 0.666504 17.9038 0.666504 19.5658 1.1418C18.072 2.63169 16.9546 3.7195 15.9809 4.48637C14.9548 5.29443 14.1683 5.67974 13.3718 5.8059C12.7845 5.89892 12.1862 5.89892 11.5989 5.8059C10.7795 5.67612 9.97091 5.27216 8.90102 4.41586C7.90484 3.61856 6.75869 2.49374 5.22213 0.959404C6.81165 0.666504 8.93655 0.666504 12 0.666504Z"
            fill={active === "/history" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
        </svg>
      ),
    },
    
    /* {
      name: "Bookmark",
      path: "/bookmark",
      active: active === "/bookmark",
      icon: (
        <svg
          width="20"
          height="25"
          viewBox="0 0 20 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.993282 4.60655C0.666992 5.61077 0.666992 6.85162 0.666992 9.33333V19.1831C0.666992 21.7393 0.666992 23.0174 1.12293 23.6933C1.67994 24.5191 2.6507 24.9655 3.64015 24.8511C4.45006 24.7574 5.42045 23.9256 7.36122 22.2621C8.21553 21.5298 8.64271 21.1637 9.11191 20.9979C9.68677 20.7948 10.3139 20.7948 10.8887 20.9979C11.3579 21.1637 11.7851 21.5298 12.6394 22.2621C14.5802 23.9256 15.5506 24.7574 16.3605 24.8511C17.3499 24.9655 18.3207 24.5191 18.8777 23.6933C19.3337 23.0174 19.3337 21.7393 19.3337 19.1831V9.33333C19.3337 6.85162 19.3337 5.61077 19.0074 4.60655C18.3479 2.57697 16.7567 0.985742 14.7271 0.32629C13.7229 0 12.482 0 10.0003 0C7.51862 0 6.27776 0 5.27355 0.32629C3.24396 0.985742 1.65273 2.57697 0.993282 4.60655ZM10.0003 3C9.44804 3 9.00033 3.44771 9.00033 4C9.00033 4.55228 9.44804 5 10.0003 5C12.3936 5 14.3337 6.9401 14.3337 9.33333C14.3337 9.88562 14.7814 10.3333 15.3337 10.3333C15.8859 10.3333 16.3337 9.88562 16.3337 9.33333C16.3337 5.83553 13.4981 3 10.0003 3Z"
            fill={active === "/bookmark" ? `${theme?.THEME_LIGHT}` : "#828282"}
          />
        </svg>
      ),
    }, */
  ];

  const navigation = useNavigate();

  const hasNavigatedRef = useRef(false);
  const handleSidebarClick = (path) => {
    setNavigatePath(path);
    //console.log(path, "path link name");
    if (isTestPage && path !== "/test") {
      setIsTestExitPopup(true);
    } else {
      setIsTestExitPopup(false);
      setActive(path);
      navigation(path);
    }
  };

  const [showPopup, setShowPopup] = useState(false);
  //console.log(location.pathname, "location.pathname");
  useEffect(() => {
    const handleBackButton = () => {
      if (location?.pathname === "/test") {
        //console.log(location?.pathname, "clicked back in browser");
        setShowPopup(true);
        setIsTestExitPopup(true);
      }
      // Prevent the default behavior of the browser back button
      window.history.pushState(null, document.title, window.location.href);
    };

    // Add event listener for browser back button click
    window.onpopstate = handleBackButton;

    return () => {
      // Cleanup function to remove event listener
      window.onpopstate = null;
    };
  }, []);

  return (
    <main className="min-h-screen  bg-[#fff] dark:bg-[#000]">
      <aside className="sidebar-container flex flex-row lg:flex-col fixed h-[70px] lg:h-full w-full lg:w-[150px] bottom-0 left-0 right-0 lg:top-0 lg:left-0 lg:bottom-0 bg-[#F5F5F7] dark:bg-[#222] z-50">
        {sidebarMenu?.map((ele, idx) => {
          const isActive = ele.name === active;
          const fillColor = isActive
            ? theme?.THEME_LIGHT
            : theme?.TAABAR_UNSELECTED_COLOR;

          return (
            <div
              key={idx}
              to={ele?.path}
              onClick={() => {
                handleSidebarClick(ele.path);
              }}
              className="w-[25%] cursor-pointer lg:w-full h-full lg:h-[25%] flex justify-center items-center self-center flex-col"
            >
              {ele?.icon}
              <p
                className={`mt-2 text-center text-[10px]  sm:text-[12px] md:text-[14px] lg:text-[16px] font-manrope-500 ${`hover-${theme?.THEME_LIGHT}`}  `}
                style={
                  ele?.active
                    ? { color: `${theme?.THEME_LIGHT}` }
                    : { color: `${theme?.TAABAR_UNSELECTED_COLOR}` }
                }
              >
                {ele?.name}
              </p>
            </div>
          );
        })}
        <div onClick= {() => {
              if (location?.pathname === "/test") {
                setSwitchPopup(true);
              } else {
                setLayoutState((prev) => ({ ...prev, isReset: true }));
              }
            }}
        className="w-[25%] cursor-pointer lg:w-full h-full lg:h-[25%] flex justify-center items-center self-center flex-col">
          <img
              className="p-2 h-[20px] md:h-[30px] w-[20px] md:w-[30px] rounded-lg"
              src={IMAGES.change}
              alt="switchcertificate"
              style={{ background: `${theme?.COLOR_LZ_BLUE}` }}
            />
            <p className="mt-2 text-center text-[10px]  sm:text-[12px] md:text-[14px] lg:text-[16px] font-manrope-500 text-black dark:text-white">
                Switch Exam
              </p>
        </div>
      </aside>

      <div className="lg:pl-[150px] pl-[0px] lg:pb-[0px] pb-[70px] min-h-screen">
        <div className="w-full min-h-full">
          <Header
            onChangeFont={() =>
              setLayoutState((prev) => ({ ...prev, changeFont: true }))
            }
            onThemeChange={() => onToggleTheme()}
            /* onChange={() => {
              if (location?.pathname === "/test") {
                setSwitchPopup(true);
              } else {
                setLayoutState((prev) => ({ ...prev, isReset: true }));
              }
            }} */
            onProfile={() => {
              handleSidebarClick("/profile");
              // navigation("/profile");
            }}
          />
          <div className="main-content w-full pt-8 pb-20">
            <Outlet />
          </div>
        </div>
      </div>
      {layoutState?.isReset && (
        <ChangeExam
          state={layoutState}
          onCancle={() => {
            setLayoutState((prev) => ({ ...prev, isReset: false }));
          }}
          onPress={(e, index) => {}}
          options={["change"]}
          title={STRINGS.change_bundle}
          desc={STRINGS.change_bundle_messge}
        />
      )}

      {layoutState?.changeFont && (
        <ChangeFont
          onChangeFont={() => {
            setLayoutState((prev) => ({
              ...prev,
              changeFont: !layoutState?.changeFont,
            }));
          }}
        />
      )}

      {isTestExitPopup && isTestPage && (
        <LAWarningPopup
          options={[STRINGS.no, STRINGS.yes]}
          title={STRINGS.test_exit_warning}
          onCancle={() => {
            setIsTestExitPopup(false);
          }}
          onPress={(e, index) => {
            if (index == 0) {
              setIsTestExitPopup(false);
            } else {
              setIsTestPage(false);
              handleSidebarClick(location.pathname);
              navigation(navigatePath);
              setActive(navigatePath);
              // onExit();
            }
          }}
        />
      )}

      {isTestExitPopup && showPopup && (
        <LAWarningPopup
          options={[STRINGS.no, STRINGS.yes]}
          title={STRINGS.test_exit_warning}
          onCancle={() => {
            setIsTestExitPopup(false);
          }}
          onPress={(e, index) => {
            if (index == 0) {
              setIsTestExitPopup(false);
              handleSidebarClick(location.pathname);
            } else {
              setIsTestPage(false);
              handleSidebarClick(location.pathname);
              navigation(navigatePath);
              setActive(navigatePath);
              // onExit();
            }
          }}
        />
      )}
      {switchPopup && (
        <LAWarningPopup
          options={[STRINGS.no, STRINGS.yes]}
          title={STRINGS.test_exit_warning}
          onCancle={() => {
            setSwitchPopup(false);
          }}
          onPress={(e, index) => {
            if (index == 0) {
              setSwitchPopup(false);
            } else {
              setLayoutState((prev) => ({ ...prev, isReset: true }));
              // onExit();
            }
          }}
        />
      )}
    </main>
  );
};

export default MainLayout;
