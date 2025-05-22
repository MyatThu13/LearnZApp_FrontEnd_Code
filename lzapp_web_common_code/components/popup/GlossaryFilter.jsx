import React, { useContext, useEffect, useRef } from "react";
import LAView from "../LAView";
import LAButton from "../LAButton";
import { IMAGES, SVG_IMAGES } from "../../assets";
import LAText from "../LAText";
import { ThemeContext } from "../../context/ThemeProvider";

const GlossaryFilter = (props) => {
  const selectedValue = props?.selectedValue;
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const alphabetAndNumbers = ["#"].concat(alphabet);
  const alphabetAndNumbersAndAll = alphabetAndNumbers.concat("ALL");

  const ref = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        props.onCancle();
      }
    };
    document.addEventListener("click", checkIfClickedOutside);
    return () => {
      document.removeEventListener("click", checkIfClickedOutside);
    };
  }, [props.onCancle]);

  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <LAView
      type="full-element-center"
      className={`min-h-screen fixed top-0  left-0 right-0 bottom-0 bg-[${theme.MODAL_BACKGROUND_COLOR}] z-[600] backdrop-blur-sm`}
      styles={{ background: `${theme?.MODAL_BACKGROUND_COLOR}` }}
    >
      <LAView
        ref={ref}
        type="center"
        flex="col"
        styles={{ background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}` }}
        className={`relative bg-[${theme.THEME_SCREEN_BACKGROUND_COLOR}] p-[24px] min-w-[30%] max-w-[50%] rounded-lg`}
      >
        <button
          className="absolute right-[24px] top-[24px]"
          onClick={props.onCancle}
        >
          <img className="w-[24px] h-[24px]" src={IMAGES.ic_cancel} />
        </button>

        <div>
          <div className="grid grid-flow-row-dense grid-cols-6 gap-2 mt-8">
            {alphabetAndNumbersAndAll?.map((ele, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => props?.onSelectItem(ele)}
                  className={`${
                    ele === "ALL" ? "col-span-3" : "col-span-1"
                  } h-12 min-w-full w-12 rounded-lg flex items-center justify-center border border-lz-blue ${
                    ele === selectedValue
                      ? "bg-lz-blue text-white dark:bg-lz-blue-3 dark:text-black"
                      : "bg-lz-blue-2 dark:bg-lz-blue-7 text-lz-blue-7 dark:text-lz-blue-2"
                  } `}
                >
                  <span>{ele}</span>
                </button>
              );
            })}
          </div>
        </div>
      </LAView>
    </LAView>
  );
};

export default GlossaryFilter;
