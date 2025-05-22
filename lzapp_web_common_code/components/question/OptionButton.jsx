import React, { useContext, useEffect } from "react";
import LAView from "../LAView";
import LAText from "../LAText";
import { ThemeContext } from "../../context/ThemeProvider";
import HTMLContent from "../HTMLContent";

const OptionButton = ({
  questionOptions,
  option,
  isShowAnswer,
  selected,
  isShowAnswerFlag,
  ID,
  isSelected,
  correct,
  selectedIndex,
  setSelectedIndex,
  OPTIONS,
  currentItem,
  savedAnswers,
  setSavedAnswers,
  onClick,
  isSubmit,
}) => {
  const { theme, currentTheme } = useContext(ThemeContext);

  const styles = {
    container: {
      flex: 1.0,
      alignItems: "center",
      borderColor: theme.THEME_SEPERATER,
      flexDirection: "row",
    },
    textContainer: {
      flex: 1.0,
    },
    options: {
      flex: 1.0,
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.THEME_SEPERATER,
    },
  };

  // option border
  const getStylesForBorderOptionSelection = () => {
    let styleClass;
    let styleClass2;
    if (Array.isArray(correct)) {
      if (isSubmit) {
        if (correct?.includes(OPTIONS[ID])) {
          if (selectedIndex?.selected?.includes(OPTIONS[ID])) {
            // container: [styles.container, { borderColor: theme.COLOR_GREEN }],
            // options: [
            //   styles.options,
            //   { borderWidth: 0, backgroundColor: theme.COLOR_GREEN },
            // ],
            // options_text: theme.NORMAL_COLOR_WHITE,
            styleClass = "text-white border-green-600";
            styleClass2 = {
              color: "white",
              border: `1px solid ${theme.COLOR_GREEN}`,
            };
          } else {
            // return {

            //   container: [styles.container, { borderColor: theme.COLOR_GREEN }],
            //   options: [
            //     styles.options,
            //     { borderWidth: 0, backgroundColor: theme.COLOR_GREEN },
            //   ],
            //   options_text: theme.NORMAL_COLOR_WHITE,
            // };

            styleClass = "text-white border-green-600";
            styleClass2 = {
              color: "white",
              border: `1px solid ${theme.COLOR_GREEN}`,
            };
          }
        } else if (selectedIndex?.selected?.includes(OPTIONS[ID])) {
          // return {
          //   container: [styles.container, { borderColor: theme.COLOR_RED }],
          //   options: [
          //     styles.options,
          //     { borderWidth: 0, backgroundColor: theme.COLOR_RED },
          //   ],
          //   options_text: theme.NORMAL_COLOR_WHITE,
          // };

          styleClass = "text-white border-red-600";
          styleClass2 = {
            color: "white",
            border: `1px solid ${theme.COLOR_RED}`,
          };
        } else {
          // styleClass2 = {
          //   border: ` text-${theme.THEME_TEXT_BLACK_LIGHT}`,
          // };
          // return {
          //   container: styles.container,
          //   options: styles.options,
          // };
          styleClass = "border-[#E2E8F1]";
          styleClass2 = {
            border: `1px solid ${theme.THEME_SEPERATER}`,
          };
        }
      } else if (selected?.includes(OPTIONS[ID])) {

        styleClass = `border-[${theme.THEME_LIGHT}]`;
        styleClass2 = {
          color: "white",
          border: `2px solid ${theme.THEME_LIGHT}`,
        };
        // styleClass = "border-[#E2E8F1]";
        // styleClass2 = {
        //   border: `1px solid ${theme.THEME_SEPERATER}`,
        // };
      }
    } else {
      if (
        isShowAnswerFlag &&
        selectedIndex?.selected &&
        selectedIndex?.selected != "X"
      ) {
        if (selectedIndex?.selected === correct && OPTIONS[ID] === correct) {
          styleClass = "text-white border-green-600";
          styleClass2 = {
            color: "white",
            border: `1px solid ${theme.COLOR_GREEN}`,
          };
        } else if (correct == OPTIONS[ID]) {
          styleClass = "text-white  border-green-600";
          styleClass2 = {
            color: "white",
            border: `1px solid ${theme.COLOR_GREEN}`,
          };
        } else if (selectedIndex?.selected === OPTIONS[ID]) {
          styleClass = "text-white border-red-600";
          styleClass2 = {
            color: "white",
            border: `1px solid ${theme.COLOR_RED}`,
          };
        } else {
          styleClass = "border-[#E2E8F1]";
          styleClass2 = {
            color: "white",
            border: `1px solid ${theme.THEME_SEPERATER}`,
          };
        }
      } else if (selectedIndex?.selected === OPTIONS[ID]) {
        styleClass = `border-[${theme.THEME_LIGHT}]`;

        styleClass2 = {
          color: "white",
          border: `2px solid ${theme.THEME_LIGHT}`,
        };
      } else {
        styleClass = "border-[#E2E8F1]";
        styleClass2 = {
          border: `1px solid ${theme.THEME_SEPERATER}`,
        };
      }
    }

    // return styleClass;
    return styleClass2;
  };

  // getting option color like A,B,C,d
  const getOptionStyle = () => {
    let styleClass;
    let styleClass2;
    if (
      isShowAnswerFlag &&
      selectedIndex?.selected &&
      selectedIndex?.selected !== "X"
    ) {
      if (selectedIndex?.selected === correct && OPTIONS[ID] === correct) {
        styleClass = "text-white bg-green-600";
        styleClass2 = {
          color: "white",
          background: `${theme.COLOR_GREEN}`,
        };
      } else if (correct == OPTIONS[ID]) {
        styleClass = "text-white-500  bg-green-600";
        styleClass2 = {
          color: "white",
          background: `${theme.COLOR_GREEN}`,
        };
      } else if (selectedIndex?.selected === OPTIONS[ID]) {
        styleClass = "text-white-500 bg-red-600";
        styleClass2 = {
          color: "white",
          background: `${theme.COLOR_RED}`,
        };
      } else {
        styleClass = "border-[#E2E8F1] text-black";
        styleClass2 = {
          color: "black",
          border: `1px solid ${theme.THEME_SEPERATER}`,
        };
      }
    } else if (selectedIndex?.selected === OPTIONS[ID]) {
      styleClass = ` bg-[${theme.THEME_LIGHT}] text-black`;
      styleClass2 = {
        color: "white",
        border: `2px solid ${theme.THEME_LIGHT}`,
        background: `${theme.THEME_LIGHT}`,
      };
    } else {
      styleClass = "border-[#E2E8F1] text-black";
      styleClass2 = {
        color: "black",
        border: `1px solid ${theme.THEME_SEPERATER}`,
      };
    }
    // return styleClass;
    return styleClass2;
  };

  function onPress() {
    if (Array.isArray(correct)) {
      if (!isSubmit) {
        onClick();
      }
    } else {
      if (isShowAnswer && (selected == "X" || selected == null)) {
        onClick();
      } else if (!isShowAnswer) {
        onClick();
      }
    }
  }

  return (
    <LAView
      styles={getStylesForBorderOptionSelection()}
      className={`${getStylesForBorderOptionSelection()} w-full cursor-pointer border-[2px] rounded-lg mb-[1%] md:mr-[1%] flex flex-row`}
      onClick={() => onPress()}
    >
      <div
        className="ml-[2%] flex-1 my-[2%]"
        style={{ color: theme?.THEME_TEXT_BLACK_LIGHT, overflow: "hidden" }}
      >
        <HTMLContent htmlContent={questionOptions} />
      </div>

      <LAView
        type="center"
        styles={{
          ...getOptionStyle(),
          padding: "10px",
          height: "100%",
        }}
        className={`${getOptionStyle()} border-[1px] rounded-lg`}
      >
        <LAText
          className="h-full lg:w-8 md:w-8 sm:w-5 w-5 flex items-center justify-center"
          size="regular"
          font="400"
          color={"black"}
          title={option}
        />
      </LAView>
    </LAView>
  );
};

export default OptionButton;
