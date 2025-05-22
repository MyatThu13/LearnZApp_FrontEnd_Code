import { Link } from "react-router-dom";
import { IMAGES } from "../assets";
import { STRINGS } from "../constant";
import LAText from "./LAText";
import LAView from "./LAView";
import { useContext } from "react";

function PremiumView(props) {
  if (props.isProfile) {
    return (
      <div className="flex items-center p-2.5 md:p-8">
      <div>
        <p className="text-gray-600 dark:text-gray-300 text-xl pb-4 font-normal">
          {STRINGS.subscribe_full_version}
        </p>
        
        <Link to="/chooseplan">
        <center>
          <div className="flex items-center mt-2.5">
            <span className="text-lz-blue text-base font-normal">
              {STRINGS.view_plans}
            </span>
            <span className="mx-1"></span>
            <span className="text-lz-blue text-base font-normal">
              {"->"}
            </span>
          </div>
          </center>
        </Link>
        
      </div>
      <img className="h-32 w-25" src={IMAGES.ic_premium} />
    </div>
    

    );
  } else {
    return (
      <LAView
        type="full-element-center"
        flex="col"
        className="justify-between p-[10px] md:p-[32px]"
        styles={{
          backgroundColor: `${props?.theme?.THEME_LIGHT} !important`,
        }}
      >
        <img
          className="hidden md:flex md:h-[65px] md:w-[50px] lg:h-[130px] lg:w-[100px] md:mt-[-25px] lg:mt-[-50px]"
          src={IMAGES.ic_premium}
        />
        <LAText
          className={`md:text-center  text-[${props?.theme?.THEME_TEXT_BLACK}]`}
          size="medium"
          font="400"
          color={""}
          styles={{
            color: `${props?.theme?.THEME_TEXT_BLACK} !important`,
          }}
          title={STRINGS.subscribe_full_version}
        />
        <Link to="/chooseplan">
          <LAView flex="row" className="flex items-center mt-[10px]">
            <LAText
              className={`text-[${props?.theme?.THEME_TEXT_BLACK}]`}
              styles={{ color: `${props?.theme?.COLOR_GREEN} !important` }}
              size="regular"
              font="400"
              color={""}
              title={STRINGS.view_plans}
            />
            <LAView className="mx-1" />
            <LAText
              className={`text-[${props?.theme?.THEME_TEXT_BLACK}]`}
              styles={{ color: `${props?.theme?.COLOR_GREEN} !important` }}
              size="regular"
              font="400"
              color={""}
              title={"->"}
            />
          </LAView>
        </Link>
      </LAView>
    );
  }
}

export default PremiumView;
