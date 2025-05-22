import React, { useContext } from "react";
import LAButton from "../LAButton";
import LAText from "../LAText";
import LAView from "../LAView";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { ThemeContext } from "../../context/ThemeProvider";
import { GET_PRACTICE_TEST } from "../../../app_constant";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { MixpanelContext } from "../../context/MixpanelProvider";

const AssesmentTest = (props) => {
  const { selectedCertificate } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { trackOnboardingAssessment } = useContext(MixpanelContext);

  return (
    <LAView
      type="full-element-center"
      className={`min-h-screen absolute top-0  left-0 right-0 bottom-0 bg-[${theme.MODAL_BACKGROUND_COLOR}] z-[600]`}
      styles={{ background: `${theme?.MODAL_BACKGROUND_COLOR}` }}
    >
      <LAView
        type="center"
        flex="col"
        className={`relative bg-[${theme.THEME_SCREEN_BACKGROUND_COLOR}] lg:p-[24px] md:p-[24px] p-[10px] sm:p-[10px] lg:min-w-[30%] md:lg:min-w-[30%] sm:lg:min-w-[50%] min-w-[50%] max-w-[70%]  rounded-lg`}
        styles={{ background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}` }}
      >
        <button
          className="absolute right-[24px] top-[24px]"
          onClick={props.onCancle}
        >
          <img className="w-[24px] h-[24px]" src={IMAGES.ic_cancel} />
        </button>
        <LAText
          className={`mt-3 text-[${theme?.THEME_TEXT_BLACK}]`}
          size="large"
          font="600"
          color={"black"}
          title={props.title}
        />
        <LAText
          className="mt-2 text-center"
          size="medium"
          font="400"
          color={"gray"}
          title={props.desc}
        />

        <div className="w-full my-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-2 lg:gap-6 md:gap-5 sm:gap-2 gap-2 w-full">
            <div className="lg:h-60 md:h-60 h-48 sm:h-48 w-full p-2 sm:p-2 md:p-4 lg:p-4 bg-gradient-to-r from-[#B6D3FF] to-[#448FFF] rounded-2xl">
              <div
                className="h-full flex flex-col justify-between text-white"
                onClick={() => {
                  const PRACTICE_TEST = GET_PRACTICE_TEST(selectedCertificate);
                  trackOnboardingAssessment("Full");
                  navigate("/test", { state: PRACTICE_TEST[0] });
                }}
              >
                <div>
                  <div className="h-16 w-16 bg-white p-2 rounded-lg">
                    <img src={IMAGES?.ic_hard_test} />
                  </div>

                  <LAText
                    className="mt-4 "
                    size="medium"
                    font="500"
                    color={"white"}
                    title={"Full Assessment"}
                  />
                </div>
                <div>
                  <h1 className="lg:text-3xl md:text-3xl sm:text-xl text-xl font-semibold ">
                    30
                  </h1>

                  <LAText
                    className=""
                    size="medium"
                    font="500"
                    color={"white"}
                    title={"Question Test"}
                  />
                </div>
              </div>
            </div>

            <div className="lg:h-60 md:h-60 h-48 sm:h-48 w-full p-2 sm:p-2 md:p-4 lg:p-4 bg-gradient-to-r from-[#FFCDB5] to-[#F68C59] rounded-2xl">
              <div
                className="h-full flex flex-col justify-between text-white"
                onClick={() => {
                  const PRACTICE_TEST = GET_PRACTICE_TEST(selectedCertificate);
                  trackOnboardingAssessment("Full");
                  navigate("/test", { state: PRACTICE_TEST[0] });
                }}
              >
                <div>
                  <div className="h-16 w-16 bg-white p-2 rounded-lg">
                    <img src={IMAGES?.ic_easy_test} />
                  </div>
                  <LAText
                    className="mt-4"
                    size="medium"
                    font="500"
                    color={"white"}
                    title={"Quick Assessment"}
                  />
                  {/* <h3 className="text-base sm:text-base lg:text-lg md:text-lg font-semibold mt-4">
                    Quick Assessment
                  </h3> */}
                </div>
                <div>
                  <h1 className="text-lg sm:text-lg lg:text-3xl md:text-3xl  font-semibold ">
                    10
                  </h1>
                  <p className="text:base sm:text-base lg:text-lg md:text-lg font-semibold ">
                    Question Test
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={props.onCancle}
          className="underline text-sm sm:text-sm lg:text-lg md:text-lg font-semibold uppercase"
        >
          Cancel
        </button>
      </LAView>
    </LAView>
  );
};

export default AssesmentTest;
