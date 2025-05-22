import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import HTMLContent from "../HTMLContent";

// COMPONENTS
// Assuming QuestionText and Text are standard React components

// CONTEXT
// Assuming ThemeContext is also a standard React context

function QuestionOptions(props) {
  const { theme, getThemeName } = useContext(ThemeContext);

  // Inline styles as an alternative to StyleSheet
  const styles = {
    container: {
      flex: "1.0",
      alignItems: "center",
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: theme.THEME_SEPERATER,
      borderRadius: "8px",
      marginTop: "10px",
      flexDirection: "row",
    },
    textContainer: {
      flex: "1.0",
      padding: "15px",
    },
    options: {
      flex: "1.0",
      padding: "20px",
      justifyContent: "center",
      borderTopLeftRadius: "6px",
      borderBottomLeftRadius: "6px",
      borderLeftWidth: "1px",
      borderLeftStyle: "solid",
      borderLeftColor: theme.THEME_SEPERATER,
    },
  };

  const OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const item = props.item;
  const index = props.index;
  const isShowAnswer = props.isShowAnswer;
  const isSubmit = props.isSubmit;
  const correct = props.correct;
  const selected = props.selected;

  function getStyles() {
    let containerStyle = { ...styles.container };
    let optionsStyle = { ...styles.options };
    let optionsTextStyle = theme.THEME_TEXT_BLACK_LIGHT;

    if (Array.isArray(props.correct)) {
      if (isSubmit) {
        if (correct.includes(OPTIONS[index])) {
          if (selected?.includes(OPTIONS[index])) {
            containerStyle.borderColor = theme.COLOR_GREEN;
            optionsStyle.backgroundColor = theme.COLOR_GREEN;
            optionsTextStyle = theme.NORMAL_COLOR_WHITE;
          } else {
            containerStyle.borderColor = theme.COLOR_GREEN;
            optionsStyle.backgroundColor = theme.COLOR_GREEN;
            optionsTextStyle = theme.NORMAL_COLOR_WHITE;
          }
        } else if (selected?.includes(OPTIONS[index])) {
          containerStyle.borderColor = theme.COLOR_RED;
          optionsStyle.backgroundColor = theme.COLOR_RED;
          optionsTextStyle = theme.NORMAL_COLOR_WHITE;
        }
      } else if (selected?.includes(OPTIONS[index])) {
        containerStyle.borderColor =
          getThemeName() === "light"
            ? theme.THEME_DARK
            : theme.THEME_FILTER_BACKGROUND;
        optionsStyle.backgroundColor =
          getThemeName() === "light"
            ? theme.THEME_DARK
            : theme.THEME_FILTER_BACKGROUND;
        optionsTextStyle = theme.NORMAL_COLOR_WHITE;
      }
    } else {
      if (isShowAnswer && selected && selected !== "X") {
        if (selected === correct && OPTIONS[index] === correct) {
          containerStyle.borderColor = theme.COLOR_GREEN;
          optionsStyle.backgroundColor = theme.COLOR_GREEN;
          optionsTextStyle = theme.NORMAL_COLOR_WHITE;
        } else if (correct === OPTIONS[index]) {
          containerStyle.borderColor = theme.COLOR_GREEN;
          optionsStyle.backgroundColor = theme.COLOR_GREEN;
          optionsTextStyle = theme.NORMAL_COLOR_WHITE;
        } else if (selected === OPTIONS[index]) {
          containerStyle.borderColor = theme.COLOR_RED;
          optionsStyle.backgroundColor = theme.COLOR_RED;
          optionsTextStyle = theme.NORMAL_COLOR_WHITE;
        }
      } else if (selected === OPTIONS[index]) {
        containerStyle.borderColor =
          getThemeName() === "light"
            ? theme.THEME_DARK
            : theme.THEME_FILTER_BACKGROUND;
        optionsStyle.backgroundColor =
          getThemeName() === "light"
            ? theme.THEME_DARK
            : theme.THEME_FILTER_BACKGROUND;
        optionsTextStyle = theme.NORMAL_COLOR_WHITE;
      }
    }

    return {
      container: containerStyle,
      options: optionsStyle,
      options_text: optionsTextStyle,
    };
  }

  function onPress() {
    if (Array.isArray(props.correct)) {
      if (!props.isSubmit) {
        props.onPress();
      }
    } else {
      if (props.isShowAnswer && (selected == "X" || selected == null)) {
        props.onPress();
      } else if (!props.isShowAnswer) {
        props.onPress();
      }
    }
  }

  const optionsStyle = getStyles();
  return (
    <div 
      style={optionsStyle.container}
      className="flex items-center justify-between cursor-pointer"
      onClick={() => onPress()}
    >
      <div style={styles.textContainer}>
        {/* Assuming QuestionText is a standard React component */}
        <HTMLContent index={index} htmlContent={item} />
        {/* <QuestionText
          className="h-full lg:w-8 md:w-8 sm:w-5 w-5 flex items-center justify-center"
          color={theme.THEME_TEXT_BLACK_LIGHT}
          key={JSON.stringify(item)}
          text={item}
        /> */}
      </div>
      <div className="h-full">
        <div
          className="h-full flex items-center justify-center"
          style={optionsStyle.options}
        >
          {/* Assuming Text is a standard React component */}
          <Text
            className="text-[18px] sm:text-[18px] md:text-[22px] lg:text-[25px] text-white"
            // font={FONT_NAME.Manrope.Medium}
            // color={optionsStyle.options_text}
            color={theme?.THEME_TEXT_BLACK_LIGHT}
            size="30px"
          >
            {OPTIONS[index]}
          </Text>
        </div>
      </div>
    </div>
  );
}

// QuestionText Component
const QuestionText = ({ color, key, text }) => (
  <p style={{ color }} key={key}>
    {text}
  </p>
);

// Text Component
const Text = ({ font, color, size, children, className }) => {
  // console.log(color, "text color");
  return (
    <span className={className} style={{ fontSize: "1.25rem", color: color }}>
      {children}
    </span>
  );
};

export default QuestionOptions;
