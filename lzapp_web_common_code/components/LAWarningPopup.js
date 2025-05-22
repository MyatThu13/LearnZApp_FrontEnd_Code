import { useCallback, useContext } from "react";
import { IMAGES, SVG_IMAGES } from "../assets";
import { STRINGS } from "../constant";
import LAButton from "./LAButton";
import LAText from "./LAText";
import LAView from "./LAView";
import { ThemeContext } from "../context/ThemeProvider";
import Webcam from "react-webcam";
import { SHOW_TOAST } from "../constant/utils";
import { UPLOAD_PROFILE } from "../api/firebase_user";
import IconTint from "react-icon-tint";

interface LAWarningPopupProps {
  onCancle: () => {};
  title: string | undefined;
  desc: string | undefined;
  options: [string] | null;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const byteString = atob(arr[1]);
  let n = byteString.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = byteString.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function LAWarningPopup(props: LAWarningPopupProps) {
  const { theme, currentTheme } = useContext(ThemeContext);

  return (
    <LAView
      type="full-element-center"
      className="fixed top-0  left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-[600] backdrop-blur-sm"
      styles={{ background: `${theme?.MODAL_BACKGROUND_COLOR}` }}
    >
      <LAView
        type="center"
        flex="col"
        className="relative bg-[#fff] p-[24px] min-w-[30%] max-w-[50%] rounded-lg"
        styles={{ background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}` }}
      >
        {props?.isCameraView ? (
          <Webcam
            audio={false}
            height={720}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={videoConstraints}
          >
            {({ getScreenshot }) => (
              <div className="w-full py-2 flex gap-3 justify-center">
                <button
                  className="w-full py-1 border rounded"
                  onClick={() => props.setIsCameraView(false)}
                  style={{
                    border: `1px solid ${
                      currentTheme === "light" ? theme?.THEME_DARK : "gray"
                    }`,
                    color: `${
                      currentTheme === "light" ? theme?.THEME_DARK : "gray"
                    }`,
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{ background: `${theme?.THEME_DARK}`, color: "white" }}
                  className="w-full py-1 border rounded "
                  onClick={async () => {
                    const imageSrc = getScreenshot();
                    const camaraImage = dataURLtoBlob(imageSrc);
                    const result = await UPLOAD_PROFILE(camaraImage);

                    // setLoading(false);

                    if (result.status) {
                      // // if (IS_BUNDLE_APP) {
                      //   console.log(result.url, "aue");
                      //   // setBundleProfilePicture(result.url)
                      // } else {
                      //   console.log(result.url, "workst case");
                      //   // setProfilePicture(result.url);
                      // }
                    } else {
                      SHOW_TOAST(result.error ?? "");
                    }

                    props.setImage(imageSrc);
                    setTimeout(() => {
                      props.setImagePicker(false);
                      props.setIsCameraView(false);
                    }, 1000);
                  }}
                >
                  Capture photo
                </button>
              </div>
            )}
          </Webcam>
        ) : (
          <>
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              {props.title}{" "}
            </h2>
            
            <div className="mb-4 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: props.desc }}></div>
            
            {props?.options?.length > 0 && (
              // <LAView className="w-full mt-4">
              //<div className="button-group flex w-full gap-2 flex-col items-center">
              <div className="flex justify-end space-x-4">
                {props?.options.map((e, index) => (
                  
                    <button
                        onClick={() => {
                          props.onPress(e, index);
                        }}
                        className="px-4 py-2 rounded-lg transition bg-lz-blue text-white hover:bg-lz-orange"
                      >
                        {e}
                      </button>
                  
                ))}
              </div>
            )}
            </div>
            </div>
          </>
        )}
      </LAView>
    </LAView>
  );
}

export default LAWarningPopup;
