import React from "react";
import LAView from "./LAView";
import LAText from "./LAText";
import { STRINGS } from "../constant";
import { IMAGES } from "../assets";
import { useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

const TabFooter = ({
  theme,
  questionArrayaLength,
  activeIndex,
  onNext,
  onPrevious,
  onEndTest,
  isEndTest,
  upgradePlan,
}) => {
  const navigate = useNavigate();
  const {
    isSubscribe,
  } = useContext(AuthContext);
  return (
    <LAView
      flex="row"
      background="secondary"
      className="flex mx-4 mb-20 sm:mb-20 md:mb-20 lg:mb-0 pb-2 lg:pl-[150px] pl-[0px] lg:pb-3  fixed w-full bottom-0 left-0 right-0 mt-3 py-2 px-4 sm:px-6 py-4 items-center justify-between"
      styles={{
        background: `${theme?.THEME_FOTTER_BACKGROUND}`,
        color: `${theme?.THEME_TEXT_BLACK}`,
      }}
    >
      {activeIndex > 0 ? (
        <LAView
          onClick={() => {
            if (questionArrayaLength > 0) onPrevious();
          }}
          className={`flex-row flex px-4 cursor-pointer sm:px-4 md:px-6 lg:px-8 py-2
              } rounded-full`}
          styles={{ background: `${theme.THEME_SCREEN_BACKGROUND_COLOR}` }}
        >
          <LAText
            className={`text-${theme?.THEME_TEXT_BLACK}`}
            // styles={{ color: `${theme?.THEME_TEXT_BLACK}` }}
            size="regular"
            font="400"
            color={""}
            title={"❮"}
          />
          <LAView className="mx-1" />
          <LAText
            className={`text-${theme?.THEME_TEXT_BLACK}`}
            // styles={{ color: `text-${theme?.THEME_TEXT_BLACK}` }}
            size="regular"
            font="400"
            color={""}
            title={STRINGS.previous}
          />
        </LAView>
      ) : (
        <span className="mx-2"></span>
      )}
      {/* false &&  */}
      {isEndTest && questionArrayaLength !== activeIndex + 1 ? (
        <button onClick={() => onEndTest()}>
          <div className="flex items-center gap-2">
            <img className="w-4 g-4" src={IMAGES?.ic_cancel} />{" "}
            <span className="text-base font-medium">End Test</span>
          </div>
        </button>
      ) : null}

      {isEndTest && questionArrayaLength === activeIndex + 1 ? (
        <>
          <LAView
            onClick={() => {
              if (activeIndex + 1 === questionArrayaLength) {
                onEndTest();
              }
            }}
            className={`flex-row flex px-4 cursor-pointer sm:px-4 md:px-6 lg:px-8 py-2  rounded-full`}
            styles={{ background: `${theme.THEME_SCREEN_BACKGROUND_COLOR}` }}
          >
            <LAText size="regular" font="400" color={""} title={"End Test"} />
            <LAView className="mx-1" />
            <LAText size="regular" font="400" color={""} title={"❯"} />
          </LAView>
        </>
      ) : (
        <>
          {questionArrayaLength === activeIndex + 1 ? (
            <>
              {!isSubscribe && upgradePlan && (
                <LAView
                  onClick={() => {
                    navigate("/chooseplan");
                  }}
                  className={`flex-row flex px-4 cursor-pointer sm:px-4 md:px-6 lg:px-8 py-2 bg-lz-blue text-white rounded-full`}
                  
                >
                  <LAText
                    size="regular"
                    font="400"
                    color={""}
                    title={`${STRINGS.upgrade_for_more} ${upgradePlan}`}
                  />
                  <LAView className="mx-1" />
              <LAText size="regular" font="400" color={""} title={"❯"} />
                </LAView>
                
              )}
            </>
          ) : (
            <LAView
              onClick={() => {
                if (activeIndex + 1 !== questionArrayaLength) {
                  onNext();
                }
              }}
              className={`flex-row flex px-4 cursor-pointer sm:px-4 md:px-6 lg:px-8 py-2  rounded-full`}
              styles={{ background: `${theme.THEME_SCREEN_BACKGROUND_COLOR}` }}
            >
              <LAText size="regular" font="400" color={""} title={"Next"} />
              <LAView className="mx-1" />
              <LAText size="regular" font="400" color={""} title={"❯"} />
            </LAView>
          )}
        </>
      )}
    </LAView>
  );
};

export default TabFooter;
