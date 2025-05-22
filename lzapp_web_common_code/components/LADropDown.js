import { useContext, useState } from "react";

//ASSETS
import { IMAGES } from "../assets";

//COMPONENT
import { LAView } from ".";
import { ThemeContext } from "../context/ThemeProvider";

interface LADropDownProps {
  name: string | undefined;
  left: JSX.Element | undefined;
  placeholder: string | undefined;
  placeholderKey: string | undefined;
  values: string | undefined;
}

function LADropDown(props: LADropDownProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <LAView
      flex="row"
      className="flex h-[40px] sm:h-[45px] md:h-[50px] lg:h-[56px] rounded-[12px] px-4 border-[#E2E8F1] border-[1px] dark:bg-[#fff] items-center"
    >
      {props.left && (
        <img className="aspect-square h-[50%] mr-4" src={props.left} />
      )}
      <select
        onChange={props.onClick}
        name={props.name}
        className="
                bg-transparent 
                w-full 
                font-manrope-400
                text-[#000] dark:text-[#fff]
                placeholder:font-manrope-400
                placeholder:text-[#ADBACC] placeholder:dark:text-[#ffffff80]
                outline-none 
                border-none 
                focus:ring-0"
        style={{ color: `${theme?.THEME_TEXT_GRAY}` }}
      >
        <option
          className="text-[#000] dark:text-[#fff]"
          style={{
            color: `${theme?.THEME_TEXT_BLACK}`,
            background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}`,
          }}
          name={props.placeholderKey}
        >
          {props.placeholder}
        </option>
        {props?.values?.map((e, index) => {
          return (
            <option
              key={index}
              name={e}
              value={e.id}
              style={{
                color: `${theme?.THEME_TEXT_BLACK}`,
                background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}`,
              }}
            >
              {e.domain_name}
            </option>
          );
        })}
      </select>
    </LAView>
  );
}

export default LADropDown;
