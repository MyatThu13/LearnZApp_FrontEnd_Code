import React from "react";

interface LAViewProps {
  className: string | undefined;
  type:
    | "full-screen-center"
    | "full-screen"
    | "full-element"
    | "full-element-center"
    | "center";
  flex: "row" | "col";
  background: "regular" | "secondary" | "tutorial";
}

function LAView(props: LAViewProps) {
  function getViewCss() {
    if (props.type == "full-screen-center") {
      return "min-h-screen justify-center items-center flex";
    } else if (props.type == "full-screen") {
      return "min-h-screen";
    } else if (props.type == "full-element") {
      return "w-full min-h-full";
    } else if (props.type == "full-element-center") {
      return "w-full min-h-full justify-center items-center flex";
    } else if (props.type == "center") {
      return "flex justify-center items-center self-center";
    }

    return "";
  }

  function getFlexCss() {
    if (props.flex == "row") {
      return "flex-row";
    } else if (props.flex == "col") {
      return "flex-col";
    }

    return "";
  }

  function getBackground() {
    if (props.background == "regular") {
      return "bg-[#fff] dark:bg-[#000]";
    } else if (props.background == "secondary") {
      return "bg-[#fff] dark:bg-[#121212]";
    } else if (props.background == "tutorial") {
      return "bg-[#FAF1ED]";
    }

    return "";
  }

  let css = `${
    props.className ? props.className : ""
  } ${getViewCss()} ${getFlexCss()} ${getBackground()}`.trim();
  return (
    <div
      key={props?.key || ""}
      ref={props?.ref}
      style={props.styles}
      className={css}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default LAView;
