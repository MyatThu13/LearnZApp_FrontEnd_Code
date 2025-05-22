import { useContext } from "react";
import { LAView, LAText } from ".";
import { ThemeContext } from "../context/ThemeProvider";

interface LAButtonProps {
  type: "social" | undefined;
  left: JSX.Element | undefined;
  title: string | undefined;
  btnType: string | "button";
}

function LAButton(props: LAButtonProps) {
  const { theme, currentTheme } = useContext(ThemeContext);
  if (props?.type == "social") {
    return (
      <button
        style={props?.styles}
        className="w-full cursor-pointer"
        type={props.btnType}
        disabled={props?.disabled}
      >
        <LAView
          onClick={props.onPress}
          flex="row"
          className="flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4 bg-[#F6FAFF] dark:bg-[#222] justify-center items-center"
        >
          {props.left && (
            <img className="aspect-square h-[40%] mr-2" src={props.left} />
          )}
          <LAText
            size="small"
            font="600"
            color={"gray"}
            title={props.title}
          ></LAText>
        </LAView>
      </button>
    );
  } else if (props?.type == "simple") {
    return (
      <LAView
        onClick={props.onPress}
        flex="row"
        className={`flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4  border-[2px] border-${theme?.THEME_TEXT_BLACK} justify-center items-center`}
      >
        {props.left && (
          <img className="aspect-square h-[40%] mr-2" src={props.left} />
        )}
        <LAText
          styles={{ color: `${theme?.THEME_TEXT_BLACK}` }}
          size="small"
          font="600"
          color={""}
          title={props.title}
        ></LAText>
      </LAView>
    );
  } else {
    return (
      <button
        type={props.btnType}
        disabled={props.disabled}
        className="w-full cursor-pointer"
      >
        <LAView
          onClick={props.onPress}
          flex="row"
          className={` ${
            props?.disabled ? "cursor-not-allowed" : ""
          } flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4  justify-center items-center`}
          styles={{
            background: `${
              currentTheme === "light"
                ? theme.THEME_DARK
                : theme?.NORMAL_COLOR_WHITE
            }`,
            color: `${currentTheme === "light" ? "white" : "black"}`,
          }}
        >
          {props.left && (
            <img className="aspect-square h-[40%] mr-2" src={props.left} />
          )}
          {props.loader && props?.loader}
          <LAText
            size="small"
            font="600"
            color={""}
            title={props.title}
          ></LAText>
        </LAView>
      </button>
    );
  }
}

export default LAButton;
