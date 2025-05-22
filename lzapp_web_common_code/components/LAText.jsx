import React from "react";

interface LATextProps {
  className: string | undefined;
  size: "extra_small" | "small" | "regular" | "large" | "medium";
  font: 200 | 300 | 400 | 500 | 600 | 700 | 800;
  color: "black" | "theme" | "gray" | "white";
  title: string | undefined;
}

function LAText(props: LATextProps) {
  function getFontSize() {
    if (props.size == "extra_small") {
      return "text-[8px] sm:text-[10px] md:text-[12px] lg:text-[12px]";
    } else if (props.size == "small") {
      return "text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]";
    } else if (props.size == "regular") {
      return "text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px]";
    } else if (props.size == "medium") {
      return "text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]";
    } else if (props.size == "large") {
      return "text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]";
    }

    return "text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]";
  }

  function getFont() {
    if (props.font == 200) {
      return "font-manrope-200";
    } else if (props.font == 300) {
      return "font-manrope-300";
    } else if (props.font == 400) {
      return "font-manrope-400";
    } else if (props.font == 500) {
      return "font-manrope-500";
    } else if (props.font == 600) {
      return "font-manrope-600";
    } else if (props.font == 700) {
      return "font-manrope-700";
    } else if (props.font == 800) {
      return "font-manrope-800";
    }

    return "font-manrope-400";
  }

  function getFontColor() {
    if (props.color == "black") {
      return "text-[#000] dark:text-[#fff]";
    } else if (props.color == "gray") {
      return "text-[#ADBACC] dark:text-[#ffffffb3]";
    } else if (props.color == "gray2") {
      return "text-[#98AAC4] dark:text-[#ffffffb3]";
    } else if (props.color == "gray3") {
      return "text-[#828282] dark:text-[#fff]";
    } else if (props.color == "theme") {
      return "text-[#007054]";
    } else if (props.color == "theme_black") {
      return "text-[#060E19] dark:text-[#fff]";
    } else if (props.color == "white") {
      return "text-[#fff]";
    } else if (props.color == "green") {
      return "text-[#00ff00]";
    } else if (props.color == "red") {
      return "text-[#ff0000]";
    }

    return "";
  }

  const fontSize = getFontSize();
  const fontFamily = getFont();
  const fontColor = getFontColor();

  let css = `${props.className} ${fontSize} ${fontFamily} ${fontColor}`;

  return (
    <p className={css} style={props?.styles} onClick={props.onClick}>
      {props.title}
      {props.children}
    </p>
  );
}

export default LAText;
