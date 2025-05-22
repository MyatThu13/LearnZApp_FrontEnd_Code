//Common Coponents
import { Text, Button } from "../components";

// import { STRINGS } from "../constant";
import LAButton from "./LAButton";
import LAText from "./LAText";
import LAView from "./LAView";

//ASSETS & CONSTANT
import { IMAGES } from "../assets";
// import { SCALE_SIZE, FONT_NAME, STRING } from "../constant";

//CONTEXT
// import { ThemeContext } from "../context";
import { useContext } from "react";
import { STRING, STRINGS } from "../constant";

/**
 * ReviewPopup is Function Component to render review dialog
 */

function ReviewPopup(props) {
  // const { theme } = useContext(ThemeContext);
  // const styles = StyleSheet.create({
  //   container: {
  //     flex: 1.0,
  //     backgroundColor: theme.MODAL_BACKGROUND_COLOR,
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  //   mainViewContainer: {
  //     width: Math.max(Dimensions.get("window").width * 0.4, 300),
  //     borderRadius: SCALE_SIZE(30),
  //     backgroundColor: theme.THEME_SCREEN_BACKGROUND_COLOR,
  //     overflow: "hidden",
  //   },
  //   cancelTouch: {
  //     justifyContent: "center",
  //     alignItems: "center",
  //     alignSelf: "flex-end",
  //     padding: 10,
  //     margin: SCALE_SIZE(30),
  //   },
  //   cancelImage: {
  //     width: SCALE_SIZE(50),
  //     height: SCALE_SIZE(50),
  //   },
  //   image: {
  //     width: Math.max(Dimensions.get("window").width * 0.4, 300),
  //     borderRadius: SCALE_SIZE(30),
  //     height: (Math.max(Dimensions.get("window").width * 0.4, 300) * 142) / 300,
  //   },
  //   titleText: {
  //     marginHorizontal: SCALE_SIZE(60),
  //     marginTop: SCALE_SIZE(30),
  //   },
  //   descText: {
  //     marginHorizontal: SCALE_SIZE(60),
  //     marginTop: SCALE_SIZE(20),
  //     marginBottom: SCALE_SIZE(30),
  //   },
  //   button: {
  //     marginHorizontal: SCALE_SIZE(60),
  //     marginTop: SCALE_SIZE(20),
  //   },
  //   buttonWork: {
  //     marginHorizontal: SCALE_SIZE(60),
  //     marginTop: SCALE_SIZE(20),
  //     marginBottom: SCALE_SIZE(60),
  //   },
  // });

  return (
    <LAView
      type="full-element-center"
      className="absolute top-0  left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-[600]"
    >
      <LAView
        type="center"
        flex="col"
        className="relative bg-[#fff] p-[24px] min-w-[30%] max-w-[50%] rounded-lg"
      >
        <button
          className="absolute right-[24px] top-[24px]"
          onClick={props.onCancle}
        >
          <img className="w-[24px] h-[24px]" src={IMAGES.ic_cancel} />
        </button>
        <img
          className="sm:w-[50px] sm:h-[50px] md:w-[73px] md:h-[73px]"
          src={IMAGES.information}
        />
        <LAText
          className="mt-3"
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
        {props?.options?.length > 0 && (
          <LAView className="w-full mt-4">
            {props?.options.map((e, index) => {
              return (
                <>
                  <LAButton
                    onPress={() => {
                      props.onPress(e, index);
                    }}
                    type={"simple"}
                    title={e}
                  />
                  {props?.options?.length - 1 != index && (
                    <LAView className="mt-3" />
                  )}
                </>
              );
            })}
          </LAView>
        )}
      </LAView>
    </LAView>
  );
}

export default ReviewPopup;
