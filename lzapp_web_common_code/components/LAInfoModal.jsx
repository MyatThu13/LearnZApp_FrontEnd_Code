import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import LAView from "./LAView";
import { IMAGES } from "../assets";
import { STRING, STRINGS } from "../constant";

const LAInfoModal = ({
  title,
  message,
  cancelText,
  options,
  onCancel,
  onPressOptions,
}) => {
  const { theme } = useContext(ThemeContext);
  return (
    <LAView
      type="full-element-center"
      className={`fixed top-0  left-0 right-0 bottom-0 bg-[${theme.MODAL_BACKGROUND_COLOR}] z-[600]`}
      styles={{ background: `${theme?.MODAL_BACKGROUND_COLOR}` }}
    >
      <LAView
        type="center"
        flex="col"
        className={`relative bg-[${theme.THEME_SCREEN_BACKGROUND_COLOR}] p-[24px] min-w-[25%] max-w-[40%] rounded-lg`}
        styles={{ background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}` }}
      >
        <button
          className="absolute right-[24px] top-[24px]"
          onClick={() => onCancel()}
        >
          <img className="w-[14px] h-[14px]" src={IMAGES.ic_cancel} />
        </button>

        <h1
          className={`text-2xl text-[${theme.THEME_TEXT_BLACK}] font-semibold pb-2 pt-2`}
        >
          {STRING.why_do_i_need_signin}{" "}
        </h1>

        <span className="text-gray-500 text-sm pb-4 text-center">
          {STRING.why_do_i_need_signin_desc}
        </span>

        
      </LAView>
    </LAView>
  );
};

export default LAInfoModal;
