import React, { useContext, useEffect, useState } from "react";
import { LAText, LATextInput, LAView } from "../../components";
import { SVG_IMAGES } from "../../assets";
import CollapseItem from "../../components/CollapseItem";
import CollapseSubItem from "../../components/CollapseSubItem";
import { GET_STUDY_QUESTION_MENU } from "../../../app_constant";
import { BundleContext } from "../../context/BundleProvider";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import _ from "lodash";
import { MixpanelContext } from "../../context/MixpanelProvider";
import BookMarkPopup from "../quickSet/BookMarkPopup";
import { STRING, STRINGS } from "../../constant";
import BackArrowIcon from "../../components/BackArrowIcon";

const StudyQuestion = () => {
  const [openItemId, setOpenItemId] = useState(2);
  const [subOpenItemId, setSubOpenItemId] = useState(null);
  const { selectedCertificate } = useContext(BundleContext);
  const { questionsList, profile, isSubscribe } = useContext(AuthContext);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMainMenu, setSelectedMainMenu] = useState(null);
  const [selectedTopicBookmark, setSelectedTopicBookmark] = useState(null);
  const [selectedBookmarkTopic, setSelectedBookmarkTopic] = useState(null);
  const [isProgressProgressBookmark, setProgressBookmark] = useState(false);
  const [isProgressQuestion, setProgressQuestion] = useState(false);
  const { theme, currentTheme } = useContext(ThemeContext);

  let STUDY_QUESTION_MENU = GET_STUDY_QUESTION_MENU(selectedCertificate);

  const selectedItems = [];

  const selectedIndex = (STUDY_QUESTION_MENU ?? []).findIndex(
    (e) => e.key == "by_topic"
  );
  selectedIndex >= 0 &&
    selectedItems.push(STUDY_QUESTION_MENU[selectedIndex].title);

  const selectedFreeIndex = (STUDY_QUESTION_MENU ?? []).findIndex(
    (e) => e.key == "by_topic_free_model"
  );
  selectedFreeIndex >= 0 &&
    selectedItems.push(STUDY_QUESTION_MENU[selectedFreeIndex].title);

  const [selectedMenu, setSelectedMenu] = useState(
    selectedIndex >= 0 ? selectedItems : []
  );
  const { trackReadinessScore, trackQuestionBookmark, trackStudyQuestions } =
    useContext(MixpanelContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTopic) {
      setProgressQuestion(true);
    }
  }, [selectedTopic]);

  useEffect(() => {
    if (selectedTopicBookmark) {
      setProgressBookmark(true);
    }
  }, [selectedTopicBookmark]);

  function getQuestionCount(ele,item) {
    let questions = [];
    if (ele.key === "bookmark") {
      const array = profile?.question_bookmarks ?? [];
      if (item.domain_name === "All Bookmarks") {
        questions = questionsList?.filter((e) => array.includes(e.id));
      } else {
        questions = questionsList?.filter((e) => array.includes(e.id)).filter((e) => e?.topic_id == item?.id);
      }
    }
    else {
      questions = questionsList?.filter((e) => e?.topic_id == item?.id);
    }
    return questions.length;
  }

  function onPressTopic(item, ele) {
    if (
      item.requires_subscription == true &&
      isSubscribe == false &&
      ele.free_model != 1
    ) {
      navigate(`/chooseplan`, {
        state: {
          canSkip: false,
          source: "study_menu",
        },
      });
      return;
    }

    trackStudyQuestions("By Topic");

    const progress = profile.questions_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.study_questions_set_id == item.id + 2;
    });

    const questions = questionsList?.filter((e) => e.topic_id == item.id);

    if (
      setProgress &&
      setProgress.length > 0 &&
      questions[0]?.id != setProgress[0]?.last_seen_question_id
    ) {
      setSelectedTopic(item);
      setSelectedMainMenu(ele);
    } else {
      if (ele.free_model == 1) {
        navigate(`/studyquestions/question`, {
          state: {
            set_id: item?.id + 2,
            source: "study_menu",
            questions: questions.slice(0, item.num_questions),
          },
        });
      } else {
        navigate(`/studyquestions/question`, {
          state: {
            set_id: item?.id + 2,
            source: "study_menu",
            questions: questions,
          },
        });
      }
    }
  }
  function onPressBookmarkTopic(subElement, ele) {
    const array = profile?.question_bookmarks ?? []
    const questions = questionsList.filter((e) => array.includes(e.id))
    
    const topic_questions = (subElement.domain_name === "All Bookmarks")
      ? questions
      : questions.filter((e) => e.topic_id === subElement.id);
    const bookmark_id = (subElement.domain_name === "All Bookmarks") ? "bookmark" : "bookmark_" + subElement.id

    if (topic_questions?.length > 0) {
        const progress = profile.questions_progress ?? []
        const setProgress = progress.filter((obj) => {
            return obj.study_questions_set_id == bookmark_id
        })

        if (setProgress && setProgress.length > 0 && topic_questions.length > 0 && topic_questions[0].id != setProgress[0].last_seen_question_id) {
            setSelectedTopicBookmark(ele)
            setSelectedBookmarkTopic(subElement)
        }
        else {
            navigate(`/studyquestions/question`, {
              state: {
                set_id: bookmark_id,
                source: "study_menu",
                questions: topic_questions,
              },
            });
        }
    }
}

  function onPressItem(item, index) {
    console.log("item", item);
    console.log("index", index);
    if (index == 0) {
      trackStudyQuestions("Bookmarks");

      const progress = profile.questions_progress ?? [];
      const setProgress = progress.filter((obj) => {
        return obj.study_questions_set_id == "bookmark";
      });

      const array = profile?.question_bookmarks ?? [];
      const questions = questionsList?.filter((e) => array.includes(e.id));
      if (
        setProgress &&
        setProgress.length > 0 &&
        questions.length > 0 &&
        questions[0]?.id != setProgress[0].last_seen_question_id
      ) {
        setSelectedTopicBookmark(item);
      } else {
        navigate(`/studyquestions/question`, {
          state: {
            set_id: "bookmark",
            questions: questions,
          },
        });
      }
    } else if (index == 1) {
      trackStudyQuestions("Quick Set");
      let questions = _.shuffle(questionsList);
      questions = questions.slice(0, 10);

      navigate(`/studyquestions/question`, {
        state: {
          title: item.title,
          questions: questions,
        },
      });
    }
  }

  function onActionBookmark(index) {
    const item = selectedBookmarkTopic;
    const array = profile?.question_bookmarks ?? [];
      const questions = questionsList?.filter((e) => array.includes(e.id));
      const topic_questions = (item.domain_name === "All Bookmarks")
      ? questions
      : questions.filter((e) => e.topic_id === item.id);
    const bookmark_id = (item.domain_name === "All Bookmarks") ? "bookmark" : "bookmark_" + item.id

    if (index == 0) {
      navigate(`/studyquestions/question`, {
        state: {
          set_id: bookmark_id,
          questions: topic_questions,
        },
      });
    } else if (index == 1) {
      const progress = profile.questions_progress;
      const setProgress = progress.filter(
        (obj) => obj.study_questions_set_id == bookmark_id
      );
      
      if (setProgress.length > 0) {
        const index = topic_questions.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_question_id
        );
        navigate(`/studyquestions/question`, {
          state: {
            set_id: bookmark_id,
            questions: topic_questions,
            lastIndex: index == -1 ? 0 : index,
          },
        });
      }
    }
  }

  function onAction(index) {
    const item = selectedTopic;
    const menu = selectedMainMenu;

    if (index == 0) {
      const questions = questionsList?.filter((e) => e.topic_id == item.id);
      if (menu.free_model == 1) {
        navigate(`/studyquestions/question`, {
          state: {
            set_id: item.id + 2,
            questions: questions.slice(0, item?.num_questions),
            free_model: 1,
          },
        });
      } else {
        navigate(`/studyquestions/question`, {
          state: {
            set_id: item.id + 2,
            questions: questions,
          },
        });
      }
    } else if (index == 1) {
      const progress = profile.questions_progress;
      const setProgress = progress.filter(
        (obj) => obj.study_questions_set_id == item.id + 2
      );
      const questions = questionsList?.filter((e) => e.topic_id == item.id);
      if (setProgress.length > 0) {
        const index = questions.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_question_id
        );

        if (menu.free_model == 1) {
          navigate(`/studyquestions/question`, {
            state: {
              set_id: item?.id + 2,
              source: "study_menu",
              questions: questions.slice(0, item?.num_questions),
              lastIndex:
                index > item?.num_questions ? 0 : index == -1 ? 0 : index,
            },
          });
        } else {
          navigate(`/studyquestions/question`, {
            state: {
              set_id: item?.id + 2,
              source: "study_menu",
              questions: questions,
              lastIndex: index == -1 ? 0 : index,
            },
          });
        }
      }
    }
  }

  useEffect(() => {
    STUDY_QUESTION_MENU = GET_STUDY_QUESTION_MENU(selectedCertificate);
  }, [selectedCertificate]);

  return (
    <>
      <LAView className=" mx-4 sm:mx-4 md:mx-8 lg:mx-8 md-4 sm:mb-4 md:mb-8 lg:mb-8">
        <LAView flex="row" className="mb-3 flex items-center px-[24px]">
          <button
            className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
            onClick={() => {
              navigate("/home");
            }}
          >
            <BackArrowIcon
              color={currentTheme === "light" ? "#101010" : "#fff"}
            />
          </button>
          <LAView flex="col" className="flex-1 mx-6">
            <LAText
              className="flex line-clamp-1 truncate"
              size="medium"
              font="600"
              color={"black"}
              title={STRING?.study_questions_title}
            />
          </LAView>
        </LAView>

        <div className="mt-2 card p-2 sm:p-2 md:p-4 lg:p-4 rounded-lg w-full">
          {STUDY_QUESTION_MENU?.map((ele, idx) => {
            const isSelected = selectedMenu.includes(ele.title);
            
            // if ele.key is bookmark, then add an element to the array ele.menu in first position
            if (ele.key === "bookmark") {
              const menu_length = ele.menu.length;
              ele.menu = [
                {
                  id: menu_length + 1,
                  domain_name: "All Bookmarks",
                  requires_subscription: false,
                },
                ...ele.menu,
              ];
            }

            if (isSubscribe && ele.free_model == 1) {
              return null;
            }

            return (
              <div
                key={idx + 1}
                className="p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg mb-2"
              >
                <CollapseItem
                  id={idx}
                  title={ele?.title}
                  defaultOpenId={true}
                  menuBg={ele?.icon_bg}
                  menuImage={ele?.image}
                  openItemId={openItemId}
                  setOpenItemId={setOpenItemId}
                  className={"w-full "}
                  left={ele?.left}
                  link={ele?.link}
                  arrowRight={ele?.menu !== null ? true : false}
                  isExpanded={isSelected}
                  onClick={() => {
                    if (ele?.menu) {
                      if (isSelected) {
                        let selected = [...selectedMenu];
                        selected = selected.filter(
                          (menu) => menu != ele?.title
                        );
                        setSelectedMenu(selected);
                      } else {
                        let selected = [...selectedMenu];
                        selected.push(ele?.title);
                        setSelectedMenu(selected);
                      }
                    } else {
                      onPressItem(ele, idx);
                    }
                  }}
                >
                  {ele?.menu
                    ? ele?.menu?.map((subElement, idx) => {
                        const no_of_que = getQuestionCount(ele,subElement);

                        return (
                          <CollapseSubItem
                            key={subElement?.id}
                            id={subElement?.id}
                            title={subElement?.domain_name}
                            openItemId={
                              subElement?.visibility ? subOpenItemId : null
                            }
                            noOfQue={
                              ele?.free_model == 1 && subElement?.num_questions
                                ? subElement?.num_questions
                                : no_of_que
                            }
                            type="Questions"
                            setOpenItemId={setSubOpenItemId}
                            className={
                              "w-full border-t border-gray-200 dark:border-gray-600 pt-2"
                            }
                            visibility={
                              ele?.key === "bookmark"
                                ? false
                                : ele?.free_model
                                ? false
                                : subElement?.requires_subscription == true && isSubscribe == false
                            }
                            // onClick={() => SubElementChoose(subElement)}
                            // onClick={() => onPressTopic(subElement, ele)}
                            onClick={() => {
                              if (ele.key === "bookmark") {
                                onPressBookmarkTopic(subElement, ele);
                              } else {
                                onPressTopic(subElement, ele);
                              }
                            }}
                          >
                            <p className="text-xs sm:text-xs lg:text-sm md:text-sm">
                              {subElement?.content}
                            </p>
                          </CollapseSubItem>
                        );
                      })
                    : ele?.content}
                </CollapseItem>
              </div>
            );
          })}
        </div>
      </LAView>

      {isProgressQuestion && (
        <BookMarkPopup
          title={STRINGS.study_questions}
          message={STRINGS.flashcard_message}
          cancelText={STRINGS?.cancel}
          options={[STRINGS.start_from_beginning, STRINGS.resume_from_stopped]}
          onCancel={() => {
            setProgressQuestion(false);
            setSelectedTopic(null);
            setSelectedMainMenu(null);
          }}
          onPressOptions={async (index) => {
            setProgressQuestion(false);
            if (index === 0) {
              setSelectedTopic(null);
              setSelectedMainMenu(null);
              onAction(index);
            } else if (index === 1) {
              setSelectedTopic(null);
              setSelectedMainMenu(null);
              onAction(index);
            }
          }}
        />
      )}

      {isProgressProgressBookmark && (
        <BookMarkPopup
          title={STRINGS.study_questions}
          message={STRINGS.flashcard_message}
          cancelText={STRINGS?.cancel}
          options={[STRINGS.start_from_beginning, STRINGS.resume_from_stopped]}
          onCancel={() => {
            setProgressQuestion(false);
            setSelectedTopic(null);
            setSelectedBookmarkTopic(null)
            setProgressBookmark(false);
          }}
          onPressOptions={async (index) => {
            setProgressBookmark(false);
            if (index === 0) {
              setSelectedTopicBookmark(null);
              setSelectedBookmarkTopic(null)
              onActionBookmark(index);
            } else if (index === 1) {
              setSelectedTopicBookmark(null);
              setSelectedBookmarkTopic(null)
              onActionBookmark(index);
            }
          }}
        />
      )}
    </>
  );
};

export default StudyQuestion;
