import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// import { Appearance } from 'react-native';

//CONSTANT & ASSETS
import { IS_BUNDLE_APP } from "../../app_constant";
import { COLORS, COLORS_DARK } from "../assets";
//CONTEXT
import { AuthContext } from "./AuthProvider";

export const ThemeContext = createContext();

export const ThemeProvider = (props) => {
  const { profile, bundleData } = useContext(AuthContext);
  const [currentTheme, setCurrentTheme] = useState("light");
  useEffect(() => {}, [localStorage.getItem("SAVED_BUNDLE_DETAILS")]);
  const currentThemeRef = useRef(null);
  currentThemeRef.current = currentTheme;

  useEffect(() => {
    const theme = localStorage.getItem("Theme") || "light";
    const body = document.body;
    if (theme === "light") {
      setCurrentTheme("light");
      body.classList.remove("dark");
    } else if (theme === "dark") {
      setCurrentTheme("dark");
      body.classList.add("dark");
    }

    // const appearance = Appearance.addChangeListener(() => {
    //     if (currentThemeRef.current == 'system') {
    //         setCurrentTheme('system_instant')
    //     }
    //     else if (currentThemeRef.current == 'system_instant') {
    //         setCurrentTheme('system')
    //     }
    // })
    // getThemeColor()
    // return () => {
    //     appearance.remove()
    // }
    getTheme();
  }, [currentTheme]);

  // useEffect(() => {
  //   getThemeColor();
  // }, [profile]);

  // async function getThemeColor() {
  //   const item = IS_BUNDLE_APP ? bundleData?.app_theme : profile?.app_theme;
  //   if (item) {
  //     setCurrentTheme(item);
  //   }
  // }

  async function setAppTheme(mode) {
    setCurrentTheme(mode);
    // UPDATE_USER_THEME(mode);
  }

  function getThemeName() {
    // if (currentTheme.includes("system")) {
    //   const systemTheme = "light";
    //   return systemTheme;
    // } else {
    return currentTheme;
    // }
  }

  function getTheme() {
    if (currentTheme.includes("system")) {
      const systemTheme = "light";

      if (systemTheme == "light") {
        return COLORS;
      } else {
        return COLORS_DARK;
      }
    } else if (currentTheme == "light") {
      return COLORS;
    } else if (currentTheme == "dark") {
      return COLORS_DARK;
    }
  }

  useEffect(() => {}, [currentTheme]);

  const theme = getTheme();
  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme,
        setCurrentTheme,
        setAppTheme,
        getThemeName,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
