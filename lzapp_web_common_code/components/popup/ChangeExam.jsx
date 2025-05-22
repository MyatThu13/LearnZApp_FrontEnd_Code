import React, { useContext, useEffect, useRef, useState } from "react";
import LAView from "../LAView";
import { IMAGES, SVG_IMAGES } from "../../assets";
import LAText from "../LAText";
import LAButton from "../LAButton";
import { auth } from "../../api/config";
// constants
import { APP_BUNDLES } from "../../../app_constant";
import { USER_DEAFULT_KEY } from "../../constant/event";
import { ThemeContext } from "../../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { BundleContext } from "../../context/BundleProvider";

const ChangeExam = (props) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { selectedCertificate, setSelectedBundle } = useContext(BundleContext);
  const selectedItem = props.isFirst ? APP_BUNDLES[0].key : selectedCertificate;

  const [userDetail, setUserDetail] = useState({});
  const [selected, setSelected] = useState(selectedItem);
  
  const onChangeBundle = async (certificateName) => {
    if (certificateName === selectedCertificate) {
      props.onCancle();
      return;
    }
    if (selected) {
      localStorage.setItem(
        USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS,
        certificateName
      );
      await setSelectedBundle(certificateName);
      props.onPress(certificateName);

      if (props.isFirst) {
        window.location.reload();
      } else {
        setTimeout(async () => {
          navigate("/prepare", {
            state: {
              firstName: userDetail?.firstName ?? "",
              isFromOnboarding: false,
              isFromLoginSignup: false,
              loginSignupType: userDetail?.loginWay ?? "",
            },
          });
        }, 500);
      }
    } else {
      await setSelectedBundle(APP_BUNDLES[0].key);
      props.onCancle();

      // await setLoading(true);
      setTimeout(async () => {
        // await setLoading(false);
        // RNRestart.Restart();
        window.location.reload();
      }, 1500);
    }

    // localStorage.setItem("SAVED_BUNDLE_DETAILS", certificateName);

    // setSelected(certificateName);
  };

  useEffect(() => {}, [selected]);

  useEffect(() => {
    let authData = {
      id: auth().currentUser?.uid,
      UserName: auth()?.currentUser?.displayName ?? "",
      email: auth().currentUser.email,
      loginWay: auth().currentUser?.providerData[0]?.providerId ?? "",
      last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
    };
    setUserDetail(authData);
  }, []);

  return (
    <div className="bg-slate-800">
      <LAView
        type="full-element-center"
        className={`min-h-screen h-screen overflow-hidden fixed top-0  left-0 right-0 bottom-0 bg-[${theme.MODAL_BACKGROUND_COLOR}]  z-[9999] backdrop-blur-sm `}
        styles={{ background: `${theme?.MODAL_BACKGROUND_COLOR}` }}
      >
        <LAView
          type="center"
          flex="col"
          className={`relative   p-[24px] min-w-[30%] max-w-[50%] rounded-lg bg-[${theme.THEME_SCREEN_BACKGROUND_COLOR}]`}
          styles={{ background: `${theme?.THEME_SCREEN_BACKGROUND_COLOR}` }}
        >
          {!props?.hideCancle && (
            <button
              className="absolute right-[24px] top-[24px]"
              onClick={props?.onCancle}
            >
              <img className="w-[24px] h-[24px]" src={IMAGES.ic_cancel} />
            </button>
          )}
          <div className="sm:w-[50px] sm:h-[50px] md:w-[73px] md:h-[73px] rounded-full  flex items-center justify-center">
            <img
              className="p-2 rounded-lg"
              src={IMAGES.change}
              alt="switchcertificate"
              style={{ background: `${theme?.THEME_LIGHT}` }}
            />
          </div>
          <LAText
            className={`mt-3 text-[${theme?.THEME_TEXT_GRAY}]`}
            size="large"
            font="500"
            color={""}
            title={props.title}
          />
          <LAText
            className={`mt-2 text-center text-[${theme?.THEME_TEXT_GRAY}]`}
            size="medium"
            font="400"
            color={""}
            title={props.desc}
          />

          <div className="w-full relative">
            {APP_BUNDLES &&
              APP_BUNDLES?.map((ele, idx) => {
                return (
                  <div className="w-full items-center">
                    <label
                      key={idx}
                      onClick={() => setSelected(ele?.key)}
                      style={{ backgroundColor: ele?.THEME_DARK }}
                      className="flex items-center justify-between mx-auto my-4 w-3/4 p-4 rounded-md mb-2"
                    >
                      <p className="text-base font-medium text-white">
                        {ele?.title}
                      </p>
                      {selected === ele?.key && (
                        <div className="rounded-md w-6 h-6">
                          <img
                            className="h-full w-full"
                            src={IMAGES?.ic_check_white}
                          />
                        </div>
                      )}
                    </label>
                  </div>
                );
              })}
          </div>
          <div className="button-group flex w-3/4 gap-2 flex-col items-center">
            <button
              onClick={(e) => {
                onChangeBundle(selected);
                localStorage.setItem(
                  USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS,
                  selected
                );
                props.onCancle();
              }}
              style={{ marginTop: "10px" }}
              className="text-gray-800 dark:text-gray-200 border-2 border-gray-500 py-2 px-6 rounded-full transition-colors w-3/4 duration-300"
            >
              <span
                style={{
                  padding: "10px",
                  fontSize: "1rem",
                  fontWeight: "normal",
                  display: "inline-block",
                }}
              >
                Continue
              </span>
            </button>
          </div>
          {/* <LAButton
            className="w-full cursor-pointer"
            onPress={(e) => {
              onChangeBundle(selected);
              localStorage.setItem(
                USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS,
                selected
              );
              props.onCancle();
            }}
            type={"simple"}
            title={"Change"}
          /> */}
        </LAView>
      </LAView>
    </div>
  );
};

export default ChangeExam;
