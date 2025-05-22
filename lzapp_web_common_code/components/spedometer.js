import { useContext, useEffect, useMemo, useRef, useState } from "react";

//CONSTANT & ASSETS
import { IMAGES } from "../assets";

//COMPONENTS
import LAView from "./LAView";

//PACKAGES
import IconTint from "react-icon-tint";
import LAText from "./LAText";
import { ThemeContext } from "../context/ThemeProvider";
import { STRING } from "../constant";


function SpeedoMeter(props) {
  //console.log("SpeedoMeter -> props", props);
  //props.data.readiness_score = 60;
  const { theme, currentTheme } = useContext(ThemeContext);
  // const value = (props.data?.readiness_score ?? 0) / 180;
  const [angle, setAngle] = useState(0);
  const score = props?.data?.readiness_score;

  // Directly determine the color based on the score
  let scoreColor = '#c73938'; // Default color for 0 to 16.66%
  if (score <= 16.66) {
    scoreColor = '#c73938';
  } else if (score <= 33.32) {
    scoreColor = '#eb4b3b';
  } else if (score <= 49.98) {
    scoreColor = '#f2940c';
  } else if (score <= 66.64) {
    scoreColor = '#f8ce18';
  } else if (score <= 83.3) {
    scoreColor = '#a2cb2d';
  } else {
    scoreColor = '#8ab712';
  }



  useEffect(() => {}, []);
  const rotationAngle = useMemo(() => {
    const percentage = Math.min(
      100,
      Math.max(0, props?.data?.readiness_score ?? 0)
    );

    if (percentage === 0) {
      setAngle(270);
      return 270;
    } else if (percentage <= 50) {
      setAngle(270 + (percentage / 50) * 90);

      return 270 + (percentage / 50) * 90;
    } else if (percentage === 51) {
      setAngle(360);
      return 360;
    } else {
      setAngle(360 + ((percentage - 51) / 49) * 89);
      return 360 + ((percentage - 51) / 49) * 89; // Adjusted for the range 51 to 100
    }
  }, [props?.data?.readiness_score]);

  

  return (
    <LAView
      flex="col"
      key={props.type}
      className={`relative z-[0] p-2 flex-col align-middle mx-auto justify-center items-center `}
    >
      <div className="flex items-center justify-center mx-auto ">
        <div className="relative w-[300px] h-[150px]  ">
          <img className="w-full h-full " src={IMAGES.ic_score_circle} />
          <div className="text-center flex items-center justify-center ">
            <LAView
              className={"absolute bottom-[5%] h-[82%] w-[5px] bg-slate-300"}
              styles={{
                transform: `rotate(${angle}deg)`,
                transformOrigin: "bottom",
              }}
            />
            <svg
              className="absolute w-[30%] bottom-0 h-auto"
              viewBox="0 0 100 50"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fill: scoreColor }}
            >
              <path d="M0,50 a50,50 0 0,1 100,0" />
            </svg>
            <span
              className="absolute bottom-[5%] text-white font-bold text-lg"
              
            >
              {`${parseInt(props?.data?.readiness_score.toFixed() ?? 0)}%`}
            </span>
            
          </div>
        </div>
      </div>

      <LAText
        className=" text-lg text-center mt-4"
        size="regular"
        font="400"
        color={"white"}
        title={"Overall Readiness Score"}
      />

      {props?.question && (
        <div className="flex items-center justify- w-full gap-4 text-white text-center mt-4">
          <LAView
            type="center"
            flex="col"
            styles={{ backgroundColor: `${theme?.THEME_SCORE_CONTAINER}` }}
            className=" p-2 rounded-2xl  w-32"
          >
            <p
              styles={{ color: `${theme?.THEME_DARK}` }}
              className={`text-sm font-normal `}
            >
              {STRING?.attempted}
            </p>
            <h2
              styles={{ color: `${theme?.THEME_DARK}` }}
              className="font-medium"
            >
              {props?.question?.questions_answered}
            </h2>
          </LAView>
          <LAView
            type="center"
            flex="col"
            styles={{
              backgroundColor: `${theme?.THEME_SCORE_CONTAINER}`,
            }}
            className=" p-2 rounded-2xl  w-32"
          >
            <p className="text-sm font-normal text-white"> {STRING?.correct}</p>
            <h2
              styles={{ color: `${theme?.THEME_DARK}` }}
              className="font-medium"
            >
              {props?.question?.questions_correct}
            </h2>
          </LAView>

          <LAView
            type="center"
            flex="col"
            styles={{
              backgroundColor: `${theme?.THEME_SCORE_CONTAINER}`,
            }}
            className=" p-2 rounded-2xl  w-32"
          >
            <p className="text-sm font-normal text-slate-200">
              {STRING?.incorrect}
            </p>
            <h2 className="font-medium">
              {props?.question?.questions_incorrect}
            </h2>
          </LAView>
        </div>
      )}
    </LAView>
  );
}

export default SpeedoMeter;
