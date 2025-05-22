
import Crown from "./images/svg/crown.svg";
import Info from "./images/svg/info.svg";
import Check from "./images/svg/check.svg";
import SearchIcon from "./images/svg/search_icon.svg";
import FilterIcon from "./images/svg/filterIcon.svg";
import DownArrow from "./images/svg/Down.svg";
import UpArrow from "./images/svg/Up.svg";
import Bookmarks from "./images/svg/bookmark.svg";
import Book from "./images/svg/books.svg";
import Clock from "./images/svg/clock.svg";
import Lock from "./images/svg/lock.svg";
import BookMarkSave from "./images/svg/bookmarkSave.svg";
import BackArrow from "./images/svg/backArrow.svg";
import PracticeTestBG from "./images/svg/practiceTestBg.svg";
import PracticeTestArt from "./images/svg/practiceTestArt.svg";
import IcPracticeTest from "./images/svg/ic_practice_test.svg";
import IcRightIcon from "./images/svg/right_icon.svg";
import Circle1 from "./images/svg/thick_circle_overlay.svg";
import Circle2 from "./images/svg/circle_2.svg";
import Circle3 from "./images/svg/circle_3.svg";
import ChangeIcon from "./images/svg/change_exam.svg";
import HomeIcon from "./images/svg/Home_icon.svg";
import dashboardIcon from "./images/svg/dashboard_icon.svg";
import {
  PREMIUM_BACKGROUND,
  PREMIUM_BACKGROUND_DARK_MODE,
  THEME_BORDER,
  THEME_BORDER_DARK_MODE,
  THEME_DARK,
  THEME_DARK_MODE,
  THEME_LIGHT,
  THEME_LIGHT_DARK_MODE,
} from "../../app_constant";

/** COLOR CONSTANT */
export const COLORS = {
  NORMAL_COLOR_WHITE: "#fff",

  //THEME COLORS
  THEME_DARK: THEME_DARK,
  THEME_LIGHT: THEME_LIGHT,
  THEME_SCORE_CONTAINER: "#f79764", //LZ_ORANGE
  THEME_INPUT_BACKGROUND: "#F6FAFF",
  THEME_SEPERATER: "#E1E8F2",
  THEME_FLASH_CARDS_SEPERATER: "#E1E8F2",
  THEME_PREMIUM_BACKGROUND: PREMIUM_BACKGROUND,

  //TUTORIAL
  THEME_TUTORIAL_BACKGROUND: "#FAF1ED",
  THEME_TUTORIAL_DETAILS_BACKGROUND: "#fff",

  //QUESTION & COMMUNITY COLOR
  COLOR_GREEN: "#10B981",
  COLOR_YELLOW: "#FBBF24",
  COLOR_RED: "#E24C5B",

  //QUICK ASSESSMENT BACKGROUND
  BLUE_GREDIENT: ["#B6D3FF", "#448FFF"],
  ORANGE_GREDIENT: ["#FFCDB5", "#F68C59"],

  //TIMER
  TIMER_20_SECOND_BACKGROUND: "#FEECEF",
  TIMER_30_SECOND_BACKGROUND: "#E6FAF1",
  TIMER_BACKGROUND: "#FFF9DF",

  //BACKGROUND COLOR
  THEME_SCREEN_BACKGROUND_COLOR: "#fff",
  THEME_SCREEN_BACKGROUND_ALPHA: "rgba(0,0,0,0.5)",

  //TEXT COLOR
  THEME_TEXT_BLACK: "#000",
  THEME_TEXT_BLACK_LIGHT: "#060E19",
  THEME_TEXT_GRAY: "#8592A6",

  TABBAR_BACKGROUND: "#fff",
  TABBAR_LANDSCAPE_BG: "#F5F5F7",
  TAABAR_UNSELECTED_COLOR: "#ADBACC",
  HEADER_ICON_BORDER: "rgba(255,255,255,0.1)",
  THEMER_FILTER_ITEM_BACKGROUND: "#F6FAFF",

  //HOME
  THEME_STUDY_QUESTION_BACKGROUND: "#EDF4FF",
  THEME_PRACTICE_TEST_BACKGROUND: "#FFF9DF",
  THEME_FLASHCARD_BACKGROUND: "#E6FAF1",
  THEME_CUSTOM_TEST_BACKGROUND: "#FEECEF",
  THEME_STUDY_ICON_BACKGROUND_COLOR: "#448FFF",
  THEME_PRACTICE_TEST_ICON_BACKGROUND_COLOR: "#FFD32A",
  THEME_FLASHCARD_ICON_BACKGROUND_COLOR: "#05C46B",
  THEME_CUSTOM_ICON_BACKGROUND_COLOR: "#F53B57",

  //PROFILE
  THEME_MENU_TEXT_COLOR: "#060E19",

  //HISTORY
  THEME_HISTORY_PROGRESS_COLOR: "#ADBACC",
  THEME_HISTORY_OVERALL_TITLE_COLOR: "#D4D4D4",
  THEME_CIRCLE_PROGRESS_BG: "rgba(0,0,0,0.3)",
  THEME_FOTTER_BACKGROUND: "#f2f2f2",

  //REVIEW TEST
  THEME_TEST_REVIEW_ITEM_BACKGROUND: "#EDF4FF",

  //POPUP BACKGROUND COLOR
  MODAL_BACKGROUND_COLOR: "rgba(0, 0, 0, 0.4)",

  THEME_FILTER_SELECTION: THEME_LIGHT,
  THEME_FILTER_BACKGROUND: THEME_LIGHT,
  COLOR_LZ_BLUE: '#0973ba',
  COLOR_LZ_BLUE_1: '#f3f8fc',
  COLOR_LZ_BLUE_2: '#c2dcee',
  COLOR_LZ_BLUE_3: '#90c0e0',
  COLOR_LZ_BLUE_4: '#6babd6',
  COLOR_LZ_BLUE_5: '#3a8fc8',
  COLOR_LZ_BLUE_6: '#08629e',
  COLOR_LZ_BLUE_7: '#065182',
  COLOR_LZ_BLUE_8: '#053f66',
  COLOR_LZ_BLUE_9: '#042e4a',
  COLOR_LZ_BLUE_10: '#021d2f',

  COLOR_LZ_ORANGE: '#f79764',
  COLOR_LZ_ORANGE_1: '#fffaf7',
  COLOR_LZ_ORANGE_2: '#fde5d8',
  COLOR_LZ_ORANGE_3: '#fbd0b9',
  COLOR_LZ_ORANGE_4: '#fac1a2',
  COLOR_LZ_ORANGE_5: '#f9ac83',
  COLOR_LZ_ORANGE_6: '#d28055',
  COLOR_LZ_ORANGE_7: '#ad6a46',
  COLOR_LZ_ORANGE_8: '#885337',
  COLOR_LZ_ORANGE_9: '#633c28',
  COLOR_LZ_ORANGE_10: '#3e2619',

};

export const COLORS_DARK = {
  NORMAL_COLOR_WHITE: "#fff",

  //THEME COLORS
  THEME_DARK: THEME_DARK_MODE,
  THEME_LIGHT: THEME_LIGHT_DARK_MODE,
  THEME_SCORE_CONTAINER: "#f79764",
  THEME_INPUT_BACKGROUND: "#1E1F25",
  THEME_SEPERATER: "#27292D",
  THEME_FLASH_CARDS_SEPERATER: "rgba(255,255,255,0.4)",
  THEME_PREMIUM_BACKGROUND: PREMIUM_BACKGROUND_DARK_MODE,

  //TUTORIAL
  THEME_TUTORIAL_BACKGROUND: "#242424",
  THEME_TUTORIAL_DETAILS_BACKGROUND: "#000",

  //QUESTION & COMMUNITY COLOR
  COLOR_GREEN: "#05c46b", 
  COLOR_YELLOW: "#f2c800",
  COLOR_RED: "#a3293b",

  //QUICK ASSESSMENT BACKGROUND
  BLUE_GREDIENT: ["#B6D3FF", "#448FFF"],
  ORANGE_GREDIENT: ["#FFCDB5", "#F68C59"],

  //TIMER
  TIMER_20_SECOND_BACKGROUND: "#fc413b",
  TIMER_30_SECOND_BACKGROUND: "#f2f2f2",
  TIMER_BACKGROUND: "#f2f2f2",

  //BACKGROUND COLOR
  THEME_SCREEN_BACKGROUND_COLOR: "#101010",
  THEME_SCREEN_BACKGROUND_ALPHA: "rgba(255,255,255,0.5)",
  THEMER_FILTER_ITEM_BACKGROUND: "#1E1F25",

  //TEXT COLOR
  THEME_TEXT_BLACK: "#fff",
  THEME_TEXT_BLACK_LIGHT: "#dddddd",
  THEME_TEXT_GRAY: "#ADBACC",

  //HOME
  TABBAR_BACKGROUND: "#1E1F25",
  TABBAR_LANDSCAPE_BG: "#1E1F25",
  TAABAR_UNSELECTED_COLOR: "#8A8B92",
  HEADER_ICON_BORDER: "rgba(255,255,255,0.1)",
  THEME_STUDY_QUESTION_BACKGROUND: "#1E1F25",
  THEME_PRACTICE_TEST_BACKGROUND: "#1E1F25",
  THEME_FLASHCARD_BACKGROUND: "#1E1F25",
  THEME_CUSTOM_TEST_BACKGROUND: "#1E1F25",
  THEME_STUDY_ICON_BACKGROUND_COLOR: '#1565C0',
    THEME_PRACTICE_TEST_ICON_BACKGROUND_COLOR: '#F9A825',
    THEME_FLASHCARD_ICON_BACKGROUND_COLOR: '#2E7D32',
    THEME_CUSTOM_ICON_BACKGROUND_COLOR: '#B71C1C',
  THEME_MENU_TEXT_COLOR: "#fff",

  //HISTORY
  THEME_HISTORY_PROGRESS_COLOR: "#ADBACC",
  THEME_HISTORY_OVERALL_TITLE_COLOR: "#D4D4D4",
  THEME_CIRCLE_PROGRESS_BG: "rgba(255,255,255,0.3)",
  THEME_FOTTER_BACKGROUND: "#242424",

  //REVIEW TEST
  THEME_TEST_REVIEW_ITEM_BACKGROUND: "#1E1F25",

  //POPUP BACKGROUND COLOR
  MODAL_BACKGROUND_COLOR: "rgba(255,255,255,0.2)",

  THEME_FILTER_SELECTION: "#fff",
  THEME_FILTER_BACKGROUND: "rgba(255,255,255,0.3)",
  COLOR_LZ_BLUE: '#0973ba',
  COLOR_LZ_BLUE_10: '#f3f8fc',
  COLOR_LZ_BLUE_9: '#c2dcee',
  COLOR_LZ_BLUE_8: '#90c0e0',
  COLOR_LZ_BLUE_7: '#6babd6',
  COLOR_LZ_BLUE_6: '#3a8fc8',
  COLOR_LZ_BLUE_5: '#08629e',
  COLOR_LZ_BLUE_4: '#065182',
  COLOR_LZ_BLUE_3: '#053f66',
  COLOR_LZ_BLUE_2: '#042e4a',
  COLOR_LZ_BLUE_1: '#021d2f',

  COLOR_LZ_ORANGE: '#f79764',
  COLOR_LZ_ORANGE_10: '#fffaf7',
  COLOR_LZ_ORANGE_9: '#fde5d8',
  COLOR_LZ_ORANGE_8: '#fbd0b9',
  COLOR_LZ_ORANGE_7: '#fac1a2',
  COLOR_LZ_ORANGE_6: '#f9ac83',
  COLOR_LZ_ORANGE_5: '#d28055',
  COLOR_LZ_ORANGE_4: '#ad6a46',
  COLOR_LZ_ORANGE_3: '#885337',
  COLOR_LZ_ORANGE_2: '#633c28',
  COLOR_LZ_ORANGE_1: '#3e2619',
};

export const IMAGES = {
  background: require("./images/background.png"),
  ic_apple: require("./images/ic_apple.png"),
  ic_google: require("./images/ic_google.png"),
  ic_skip: require("./images/ic_skip.png"),
  slide_1: require("./images/slide_1.png"),
  slide_2: require("./images/slide_2.png"),
  slide_3: require("./images/slide_3.png"),
  slide_4: require("./images/slide_4.png"),
  slide_5: require("./images/slide_5.png"),
  ic_back: require("./images/ic_back.png"),
  info_background: require("./images/info_background.png"),
  logo: require("./images/logo_prepare.png"),
  crown: require("./images/crown.png"),
  price_crown: require("./images/price_crown.png"),
  quick_assessment: require("./images/quick_assessment.png"),
  ic_dark_mode: require("./images/ic_dark_mode.png"),
  ic_light_mode: require("./images/ic_light_mode.png"),
  ic_notification: require("./images/ic_notification.png"),
  ic_account: require("./images/ic_account.png"),
  ic_profile: require("./images/ic_profile.png"),
  ic_avatar: require("./images/ic_avatar.png"),
  ic_subscription: require("./images/ic_subscription.png"),
  ic_share_app: require("./images/ic_share_app.png"),
  ic_other_app: require("./images/ic_other_app.png"),
  ic_help: require("./images/ic_help.png"),
  ic_signout: require("./images/ic_signout.png"),
  ic_camera: require("./images/ic_camera.png"),
  ic_tab_home: require("./images/ic_tab_home.png"),
  ic_tab_dashboard: require("./images/ic_tab_dashboard.png"),
  ic_tab_hisotry: require("./images/ic_tab_hisotry.png"),
  ic_tab_study_plan: require("./images/ic_tab_study_plan.png"),
  ic_tab_bookmark: require("./images/ic_tab_bookmark.png"),
  ic_notification_home: require("./images/ic_notification_home.png"),
  ic_user_home: require("./images/ic_user_home.png"),
  ic_input_cancel: require("./images/ic_input_cancel.png"),
  ic_email: require("./images/ic_email.png"),
  ic_lock: require("./images/ic_lock.png"),
  ic_eye_hidden: require("./images/ic_eye_hidden.png"),
  ic_view: require("./images/ic_view.png"),
  ic_hide: require("./images/ic_hide.png"),
  ic_check: require("./images/ic_check.png"),
  ic_check_white: require("./images/ic_check_white.png"),
  ic_free_rect: require("./images/ic_free_rect.png"),
  ic_save: require("./images/ic_save.png"),
  ic_edit: require("./images/ic_edit.png"),
  ic_info_close: require("./images/ic_info_close.png"),
  ic_read: require("./images/ic_read.png"),
  ic_easy_test: require("./images/ic_easy_test.png"),
  ic_hard_test: require("./images/ic_hard_test.png"),
  ic_premium: require("./images/ic_premium.png"),
  ic_home_custom: require("./images/ic_home_custom.png"),
  ic_home_flash: require("./images/ic_home_flash.png"),
  ic_home_quiz: require("./images/ic_home_quiz.png"),
  ic_home_practice: require("./images/ic_home_practice.png"),
  ic_menu: require("./images/ic_menu.png"),
  ic_plus: require("./images/ic_plus.png"),
  ic_down_arrow: require("./images/ic_down_arrow.png"),
  ic_delete: require("./images/ic_delete.png"),
  ic_search: require("./images/ic_search.png"),
  ic_timer: require("./images/ic_timer.png"),
  ic_previous: require("./images/ic_previous.png"),
  flash_bg: require("./images/flash_bg.png"),
  ic_up_arrow: require("./images/ic_up_arrow.png"),
  ic_score_circle: require("./images/ic_score_circle.png"),
  ic_score_container: require("./images/ic_score_container.png"),
  ic_user: require("./images/ic_user.png"),
  ic_flash_bookmark: require("./images/ic_flash_bookmark.png"),
  ic_flash_exam: require("./images/ic_flash_exam.png"),
  ic_flash_quick_set: require("./images/ic_flash_quick_set.png"),
  ic_flash_topic: require("./images/ic_flash_topic.png"),
  ic_cancel: require("./images/ic_cancel.png"),
  other_app: require("./images/other_app.png"),
  logo_prepare: require("./images/logo_prepare.png"),
  practice_bg: require("./images/practice_bg.png"),
  logo_white: require("./images/logo_white.png"),
  ic_reset: require("./images/ic_reset_data.png"),
  ic_review: require("./images/ic_review_app.png"),
  app_review_dialog: require("./images/app_review_dialog.jpg"),
  delete: require("./images/delete.png"),
  information: require("./images/information-button.png"),
  change: require("./images/change.png"),
  community: require("./images/group_users.png"),
  filter: require("./images/filter.png"),
  affiliate_image: require("./images/affiliate_image.jpg"),
  ic_font: require("./images/font.png"),
  ic_book_mark_unselected: require("./images/bookmark_unselected.png"),
  ic_book_mark_selected: require("./images/bookmark.png"),
  ic_network: require("./images/ic_network.png"),
};

export const SVG_IMAGES = {
  crown: Crown,
  info: Info,
  check: Check,
  searchIcon: SearchIcon,
  filterIcon: FilterIcon,
  DownArrow: DownArrow,
  UpArrow: UpArrow,
  Bookmarks: Bookmarks,
  Book: Book,
  Clock: Clock,
  Lock: Lock,
  BookMarkSave: BookMarkSave,
  BackArrow: BackArrow,
  PracticeTestBG: PracticeTestBG,
  PracticeTestArt: PracticeTestArt,
  ic_practice_test: IcPracticeTest,
  IcRightIcon: IcRightIcon,
  Circle1: Circle1,
  Circle2: Circle2,
  Circle3: Circle3,
  ChangeIcon: ChangeIcon,
  homeIcon: HomeIcon,
  dashboardIcon: dashboardIcon,
};

