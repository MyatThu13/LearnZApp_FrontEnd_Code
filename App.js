import "./App.css";

//PACKAGES
import { BrowserRouter, Route, Routes } from "react-router-dom";

//SCREENS
import PageRouter from "./lzapp_web_common_code/components/Router";
import { AppProvider } from "./lzapp_web_common_code/context/AppProvider";
import { AuthProvider } from "./lzapp_web_common_code/context/AuthProvider";
import {
  BundleContext,
  BundleProvider,
} from "./lzapp_web_common_code/context/BundleProvider";
import { MixpanelProvider } from "./lzapp_web_common_code/context/MixpanelProvider";
import {
  ThemeContext,
  ThemeProvider,
} from "./lzapp_web_common_code/context/ThemeProvider";
import { useContext, useEffect, useState } from "react";
import { APP_BUNDLES } from "./app_constant";
import { COLORS, COLORS_DARK } from "./lzapp_web_common_code/assets";
import { USER_DEAFULT_KEY } from "./lzapp_web_common_code/constant/event";
import Loader from "./lzapp_web_common_code/components/loader";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Function to get query parameters
    const getQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        return {
            promo_code: params.get('promo_code')
        };
    };

    // Capture the promo code from the URL
    const queryParams = getQueryParams();
    if (queryParams.promo_code) {
        localStorage.setItem('promo_code', queryParams.promo_code);
    }
}, []);

  useEffect(() => {}, [localStorage.getItem("SAVED_BUNDLE_DETAILS")]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    setThemeColor();

    return () => clearTimeout(timeout);
  }, []);

  async function setThemeColor() {
    // if (IS_BUNDLE_APP) {
    const result = localStorage.getItem(USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS);
    if (result) {
      const selectedBundles = APP_BUNDLES.filter((e) => e.key == result);
      if (selectedBundles.length > 0) {
        COLORS.THEME_DARK = selectedBundles[0].THEME_DARK;
        COLORS.THEME_LIGHT = selectedBundles[0].THEME_LIGHT;
        COLORS.THEME_SCORE_CONTAINER = selectedBundles[0].THEME_BORDER;
        COLORS.THEME_PREMIUM_BACKGROUND = selectedBundles[0].PREMIUM_BACKGROUND;
        COLORS_DARK.THEME_DARK = selectedBundles[0].THEME_DARK_MODE;
        COLORS_DARK.THEME_LIGHT = selectedBundles[0].THEME_LIGHT_DARK_MODE;
        COLORS_DARK.THEME_SCORE_CONTAINER =
          selectedBundles[0].THEME_BORDER_DARK_MODE;
        COLORS_DARK.THEME_PREMIUM_BACKGROUND =
          selectedBundles[0].PREMIUM_BACKGROUND_DARK_MODE;
      } else {
        COLORS.THEME_DARK = APP_BUNDLES[0].THEME_DARK;
        COLORS.THEME_LIGHT = APP_BUNDLES[0].THEME_LIGHT;
        COLORS.THEME_SCORE_CONTAINER = APP_BUNDLES[0].THEME_BORDER;
        COLORS.THEME_PREMIUM_BACKGROUND = APP_BUNDLES[0].PREMIUM_BACKGROUND;

        COLORS_DARK.THEME_DARK = APP_BUNDLES[0].THEME_DARK_MODE;
        COLORS_DARK.THEME_LIGHT = APP_BUNDLES[0].THEME_LIGHT_DARK_MODE;
        COLORS_DARK.THEME_SCORE_CONTAINER =
          APP_BUNDLES[0].THEME_BORDER_DARK_MODE;
        COLORS_DARK.THEME_PREMIUM_BACKGROUND =
          APP_BUNDLES[0].PREMIUM_BACKGROUND_DARK_MODE;
      }
    } else {
      COLORS.THEME_DARK = APP_BUNDLES[0].THEME_DARK;
      COLORS.THEME_LIGHT = APP_BUNDLES[0].THEME_LIGHT;
      COLORS.THEME_SCORE_CONTAINER = APP_BUNDLES[0].THEME_BORDER;
      COLORS.THEME_PREMIUM_BACKGROUND = APP_BUNDLES[0].PREMIUM_BACKGROUND;

      COLORS_DARK.THEME_DARK = APP_BUNDLES[0].THEME_DARK_MODE;
      COLORS_DARK.THEME_LIGHT = APP_BUNDLES[0].THEME_LIGHT_DARK_MODE;
      COLORS_DARK.THEME_SCORE_CONTAINER = APP_BUNDLES[0].THEME_BORDER_DARK_MODE;
      COLORS_DARK.THEME_PREMIUM_BACKGROUND =
        APP_BUNDLES[0].PREMIUM_BACKGROUND_DARK_MODE;
    }
    // setLoading(false);
    // }
  }
  return (
    <BundleProvider>
      <MixpanelProvider>
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>
              <BrowserRouter>
                {loading ? <Loader /> : <PageRouter />}
              </BrowserRouter>
            </AppProvider>
          </ThemeProvider>
        </AuthProvider>
      </MixpanelProvider>
    </BundleProvider>
  );
}

export default App;
