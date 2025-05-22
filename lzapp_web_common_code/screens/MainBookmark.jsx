//PACKAGES
import { useNavigate } from "react-router-dom";

//CONSTANTS & ASSETS
import { STRINGS } from "../constant";
import { IMAGES } from "../assets";

//COMPONENTS
import {
  LADropDown,
  LAView,
  LAText,
} from "../components";

//PACKAGES
import IconTint from "react-icon-tint";
import { GET_APP_DOMAIN_LIST } from "../../app_constant";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import { BundleContext } from "../context/BundleProvider";
import { MixpanelContext } from "../context/MixpanelProvider";
import HTMLContent from "../components/HTMLContent";

function MainBookmark() {
  const { profile, questionsList, removeQuestionFromBookmark } =
    useContext(AuthContext);
  const [bookmarkQuestions, setBookmarkQuestions] = useState([]);
  const [taskDomain, setTaskDomain] = useState("");
  const [isVisibleDomain, setIsVisibleDomain] = useState(false);
  const { theme, currentTheme } = useContext(ThemeContext);

  const navigate = useNavigate();

  const percentage = 66;

  const { selectedCertificate } = useContext(BundleContext);
  const { trackBookmark, trackQuestionBookmark } = useContext(MixpanelContext);
  useEffect(() => {
    if (taskDomain) {
      getTopicId(taskDomain);
    }
  });

  function getTopicId(id) {
    const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
    const array = APP_DOMAIN_LIST?.find((e) => e.id === id);

    return array?.domain_name ?? "";
  }

  useEffect(() => {
    // trackBookmark()

    if (taskDomain) {
      const array = profile?.question_bookmarks ?? [];
      let questions = (questionsList ?? []).filter((e) => array.includes(e.id));

      questions = questions.filter((e) => e.topic_id == taskDomain);
      let result = [];
      questions?.forEach(function (a) {
        result[array.indexOf(a.id)] = a;
      });

      result = result.filter((e) => e != null);
      const newData = result.sort((a, b) => {
        return a?.id - b?.id;
      });
      setBookmarkQuestions(newData);
    } else {
      const array = profile?.question_bookmarks ?? [];
      const questions = questionsList?.filter((e) => array.includes(e.id));

      let result = [];
      questions.forEach(function (a) {
        result[array.indexOf(a.id)] = a;
      });

      result = result.filter((e) => e != null);
      const newData = result?.sort((a, b) => {
        return a?.id - b?.id;
      });

      setBookmarkQuestions(newData);
    }
  }, [taskDomain, profile?.question_bookmarks]);
  const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);

  return (
    <>
      {/* <LAView>
      <Header onChange={() => {}} onProfile={() => {}} /> */}
      <LAView className="px-[24px]">
        <LAText
          className="flex line-clamp-1 truncate"
          size="medium"
          font="600"
          color={"black"}
          title={STRINGS.bookmark}
        />
        <LAView className="mt-4" />
        <LADropDown
          style={{ backgroundColor: theme?.THEME_SCREEN_BACKGROUND_COLOR }}
          values={APP_DOMAIN_LIST}
          placeholder="All Domains"
          placeholderKey={""}
          onClick={(e) => {
            setIsVisibleDomain(false);
            if (e.target.value === "All Domains") {
              setTaskDomain("");
            } else {
              setTaskDomain(e.target.value);
            }
          }}
        />

        {bookmarkQuestions?.length > 0 ? (
          <LAView
            flex="col"
            className="flex md:border-[rgba(0,0,0,0.1)] md:dark:border-[rgba(255,255,255,0.5)] md:rounded-[20px] md:border-[1px] md:p-[24px] my-4"
          >
            {bookmarkQuestions?.map((e, index) => {
              return (
                <BoomarkItem
                  key={index}
                  bookmarkItem={e}
                  questionNum={index}
                  taskDomain={taskDomain}
                  onClick={() => {
                    const array = profile?.question_bookmarks ?? [];
                    let questions = questionsList?.filter((e) =>
                      array.includes(e.id)
                    );
                    if (taskDomain) {
                      questions = questions.filter(
                        (e) => e.topic_id == taskDomain.id
                      );
                    }

                    let result = [];
                    questions.forEach(function (a) {
                      result[array.indexOf(a.id)] = a;
                    });
                    result = result.filter((e) => e != null);
                    navigate("/bookmark/questions", {
                      state: {
                        questions: questions,
                        title: STRINGS.bookmark,
                        questionsListGet: questions,
                        lastIndex: index,
                        isShowPop: false,
                        set_id: index,
                      },
                    });

                    //                   const lastIndex = state?.lastIndex ?? 0;
                    // const set_id = state?.set_id ?? "";
                    // const questionsListGet = state?.questions ?? [];
                    // const isShowPop = state?.isShow;

                    // props.navigation.navigate(
                    //     SCREENS.StudyQuestion.identifier,
                    //     {
                    //         questions: result,
                    //         title: STRINGS.bookmark,
                    //         lastIndex: index,
                    //     },
                    // );
                  }}
                />
              );
            })}
          </LAView>
        ) : (
          <LAView className="px-[24px] pt-20 ">
            <div className="w-full flex flex-col justify-center items-center h-[50vh]">
              <img src={IMAGES.ic_tab_bookmark} width={60} className="pb-6" />
              <h5 className="text-gray-400">{STRINGS.no_question_boomark}</h5>
            </div>
          </LAView>
        )}
      </LAView>
    </>
  );
}

function BoomarkItem(props) {
  const { profile, questionsList, removeQuestionFromBookmark } =
    useContext(AuthContext);
  const { theme, currentTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  return (
    <LAView key={props.key}>
      <div className="flex items-center justify-between">
        <LAView
          key={props.key}
          flex=""
          className="flex items-center justify-between cursor-pointer"
          onClick={props?.onClick}
        >
          <LAView flex="col" key={props.key} className="flex">
            <LAText
              size="small"
              font="400"
              color={"gray2"}
              title={`Question ${props?.questionNum + 1}`} // this is for question number
            />
            <HTMLContent
              htmlContent={props?.bookmarkItem?.question}
              className="line-clamp-1"
            />
          </LAView>
        </LAView>
        <button
          onClick={() =>
            // () => trackQuestionBookmark(-1)
            removeQuestionFromBookmark(props?.bookmarkItem?.id)
          }
        >
          <IconTint
            color={theme?.COLOR_RED}
            className="mb-1 h-[20px] sm:h-[22px] md:h-[24px] lg:h-[26px] w-[20px] sm:w-[22px] md:w-[24px] lg:w-[26px]"
            src={IMAGES.ic_tab_bookmark}
          />
        </button>
      </div>
      <LAView className="border-[1px] border-[#E2E8F1] my-[16px]" />
    </LAView>
  );
}

export default MainBookmark;
