import React, { useContext, useState, useEffect } from "react";
import { LAText, LAView, LAWarningPopup } from "../../components";
import CollapseItem from "../../components/CollapseItem";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { useNavigate } from "react-router-dom";
import { STRINGS } from "../../constant";
import { AuthContext, AuthProvider } from "../../context/AuthProvider";
import { GET_FLASHCARDS } from "../../api/content";
import { GET_FLASH_CARD_MENU } from "../../../app_constant";
import { BundleContext } from "../../context/BundleProvider";
import CollapseSubItem from "../../components/CollapseSubItem";
import _ from "lodash";
import BackArrowIcon from "../../components/BackArrowIcon";
import { ThemeContext } from "../../context/ThemeProvider";
import BookMarkPopup from "../quickSet/BookMarkPopup";
import { MixpanelContext } from "../../context/MixpanelProvider";

const FlashCards = () => {
  const { selectedCertificate } = useContext(BundleContext);
  const { profile, isSubscribe } = useContext(AuthContext);
  const { trackFlashcardRecord, trackFlashcardBookmark } =
    useContext(MixpanelContext);

  const navigate = useNavigate();
  const [openItemId, setOpenItemId] = useState(3);
  const [subOpenItemId, setSubOpenItemId] = useState(null);
  const [flashCardTest, setFlashCardTest] = useState({
    isReset: true,
    testPopup: false,
  });
  const FLASHCARDS = GET_FLASHCARDS(selectedCertificate);
  const { theme, currentTheme } = useContext(ThemeContext);
  const [queCount, setQueCount] = useState();

  const FLASH_CARD_MENU = GET_FLASH_CARD_MENU(selectedCertificate);
  const selectedItems = [];
  const selectedIndex = (FLASH_CARD_MENU ?? []).findIndex(
    (e) => e.key == "by_topic"
  );
  selectedIndex >= 0 &&
    selectedItems.push(FLASH_CARD_MENU[selectedIndex].title);

  const selectedFreeIndex = (FLASH_CARD_MENU ?? []).findIndex(
    (e) => e.key == "by_topic_free_model"
  );
  selectedFreeIndex >= 0 &&
    selectedItems.push(FLASH_CARD_MENU[selectedFreeIndex].title);

  function getQuestionCount(item) {
    const cards = FLASHCARDS.filter((e) => e.topic_id == item.id);
    return cards.length;
  }

  function onPressItem(item, index) {
    if (index == 0) {
      onPressBookmark(item);
    } else if (index == 1) {
      // trackFlashcard("Quick Set");
      let cards = _.shuffle(FLASHCARDS);
      cards = cards.slice(0, 10);
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "exam",
          title: item.title,
        },
      });
    } else if (item.key == "exam") {
      onPressExam(item);
    } else if (item.key == "all_cards") {
      onPressAll(item);
    } else {
      navigate("/flashcard/questions", {
        state: {
          cards: item,
          set_id: "exam",
          title: item.title,
        },
      });
    }
  }

  function onPressBookmark(item) {
    // trackFlashcard("Bookmark");

    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == "bookmark";
    });

    const array = profile?.flashcard_bookmarks ?? [];
    const cards = FLASHCARDS.filter((e) => array.includes(e?.id));

    if (
      setProgress &&
      setProgress.length > 0 &&
      cards.length > 0 &&
      cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
    ) {
      setProgressBookmark(true);
    } else {
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "bookmark",
          title: item.title,
        },
      });
    }
  }

  function onPressExam(item) {
    
    // trackFlashcard("Exam Essentials");
    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == "exam";
    });

    if (item?.topic_ids) {
      const cards = FLASHCARDS.filter((e) =>
        item.topic_ids.includes(e.topic_id)
      );
      if (
        setProgress &&
        setProgress.length > 0 &&
        cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
      ) {
        setExamProgressQuestion(true);
      } else {
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: "exam",
            title: item.title,
          },
        });
        // navigate("/flashcard/questions", {
        //   state: {
        //     cards: cards,
        //     set_id: "exam",
        //     title: item.title,
        //   },
        // });
      }
    } else {
      const cards = FLASHCARDS.filter((e) => e.type == "Exam Essentials");
      if (
        setProgress &&
        setProgress.length > 0 &&
        cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
      ) {
        setExamProgressQuestion(true);
      } else {
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: "exam",
            title: item.title,
          },
        });
      }
    }
  }

  function onPressAll(item) {
    // trackFlashcard("All Flashcards");

    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == 1 + 2;
    });

    if (item?.topic_ids) {
      const cards = FLASHCARDS.filter((e) =>
        item.topic_ids.includes(e.topic_id)
      );
      if (
        setProgress &&
        setProgress.length > 0 &&
        cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
      ) {
        setProgressQuestion(true);
      } else {
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: 1 + 2,
            title: item.title,
          },
        });
      }
    } else {
      const cards = FLASHCARDS;
      if (
        setProgress &&
        setProgress.length > 0 &&
        cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
      ) {
        setProgressQuestion(true);
      } else {
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: 1 + 2,
          },
        });
      }
    }
  }

  const [selectedMenu, setSelectedMenu] = useState(
    selectedIndex >= 0 ? selectedItems : []
  );
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedMainMenu, setSelectedMainMenu] = useState(null);
  const [isProgressQuestion, setProgressQuestion] = useState(false);
  const [isExamProgressQuestion, setExamProgressQuestion] = useState(false);

  const [selectedTopicBookmark, setSelectedTopicBookmark] = useState(null);
  const [isProgressBookmark, setProgressBookmark] = useState(false);

  const [isReset, setIsReset] = useState(true);

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

  function SubElementChoose(item, ele) {
    
    if (
      item.requires_subscription == true &&
      isSubscribe === false &&
      ele?.free_model != 1
    ) {
      navigate("/chooseplan");
      return;
    }
    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == item.id + 2;
    });
    const cards = FLASHCARDS.filter((e) => e.topic_id == item.id);
    if (
      setProgress &&
      setProgress.length > 0 &&
      cards[0]?.id != setProgress[0]?.last_seen_flashcard_id
    ) {
      setSelectedTopic(item);
      setSelectedMainMenu(ele);
    } else {
      if (ele?.free_model == 1) {
        navigate("/flashcard/questions", {
          state: {
            cards: cards.slice(0, item.num_flashcards),
            set_id: item.id + 2,
            title: item.title,
          },
        });
      } else {
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: item.id + 2,
            title: item.title,
          },
        });
      }
    }
  }

  function onActionBookmark(index) {
    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == "bookmark";
    });

    const item = FLASH_CARD_MENU.find((e) => e.key == "bookmark");

    const array = profile?.flashcard_bookmarks ?? [];
    const cards = FLASHCARDS.filter((e) => array.includes(e.id));

    if (index == 0) {
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "bookmark",
          title: item.title,
        },
      });
    } else if (setProgress.length > 0) {
      if (item?.topic_ids) {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress.last_seen_flashcard_id
        );

        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: "bookmark",
            title: item.title,
            lastIndex: index == -1 ? 0 : index,
          },
        });
      } else if (index === 1) {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress.last_seen_flashcard_id
        );

        navigate("/flashcard/questions", {
          state: {
            set_id: item.id + 2,
            cards: cards,
            set_id: "bookmark",
            title: item.title,
            lastIndex: index == -1 ? 0 : index,
          },
        });
      }
    } else {
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "bookmark",
          title: item.title,
        },
      });
    }
  }

  function onActionExam(index) {
    
    const progress = profile.flashcards_progress ?? [];
    const setProgress = progress.filter((obj) => {
      return obj.flashcard_set_id == "exam";
    });

    const item = FLASH_CARD_MENU.find((e) => e.key == "exam");
    let cards = [];
    if (item?.topic_ids) {
      cards = FLASHCARDS.filter((e) => item.topic_ids.includes(e.topic_id));
    } else {
      cards = FLASHCARDS.filter((e) => e.type == "Exam Essentials");
    }

    if (index == 0) {
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "exam",
          title: item.title,
        },
      });
    } else if (setProgress.length > 0) {
      if (item?.topic_ids) {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_flashcard_id
        );
        navigate("/flashcard/questions", {
          state: {
            cards: cards,
            set_id: "exam",
            lastIndex: index == -1 ? 0 : index,
          },
        });
      } else {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_flashcard_id
        );
        navigate("/flashcard/questions", {
          state: {
            set_id: item.id + 2,
            cards: cards,
            set_id: "exam",
            lastIndex: index == -1 ? 0 : index,
          },
        });
      }
    } else {
      navigate("/flashcard/questions", {
        state: {
          cards: cards,
          set_id: "exam",
          title: item.title,
        },
      });
    }
  }

  function onAction(index) {
    const item = selectedTopic;
    const menu = selectedMainMenu;
    if (index == 0 && item) {
      const cards = FLASHCARDS.filter((e) => e.topic_id === item.id);
      if (menu?.free_model == 1) {
        navigate("/flashcard/questions", {
          state: {
            set_id: item.id + 2,
            cards: cards.slice(0, item.num_flashcards),
          },
        });
      } else {
        navigate("/flashcard/questions", {
          state: {
            set_id: item.id + 2,
            cards: cards,
          },
        });
      }
    } else if (index == 0) {
      let cards = FLASHCARDS.filter((e) => e.topic_id === 100);
      cards = cards.length == 0 ? FLASHCARDS : cards;

      if (menu?.free_model == 1) {
        navigate("/flashcard/questions", {
          state: {
            set_id: 1 + 2,
            cards: cards.slice(0, item.num_flashcards),
          },
        });
      } else {
        navigate("/flashcard/questions", {
          state: {
            set_id: 1 + 2,
            cards: cards,
          },
        });
      }
    } else if (index == 1 && item) {
      const progress = profile.flashcards_progress;
      const setProgress = progress.filter(
        (obj) => obj.flashcard_set_id == item.id + 2
      );
      const cards = FLASHCARDS.filter((e) => e.topic_id == item.id);
      if (setProgress.length > 0) {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_flashcard_id
        );

        if (menu?.free_model == 1) {
          navigate("/flashcard/questions", {
            state: {
              set_id: item.id + 2,
              cards: cards.slice(0, item.num_flashcards),
              lastIndex: index >= cards.length ? 0 : index == -1 ? 0 : index,
            },
          });
        } else {
          navigate("/flashcard/questions", {
            state: {
              set_id: item.id + 2,
              cards: cards,
              lastIndex: index == -1 ? 0 : index,
            },
          });
        }
      }
    } else if (index == 1) {
      const progress = profile.flashcards_progress;
      const setProgress = progress.filter(
        (obj) => obj.flashcard_set_id == 1 + 2
      );
      let cards = FLASHCARDS.filter((e) => e.topic_id == 100);
      cards = cards.length == 0 ? FLASHCARDS : cards;
      if (setProgress.length > 0) {
        const index = cards.findIndex(
          (obj) => obj.id == setProgress[0].last_seen_flashcard_id
        );

        if (menu?.free_model == 1) {
          navigate("/flashcard/questions", {
            state: {
              set_id: 1 + 2,
              cards: cards.slice(0, item.num_flashcards),
              lastIndex: index >= cards.length ? 0 : index == -1 ? 0 : index,
            },
          });
        } else {
          navigate("/flashcard/questions", {
            state: {
              set_id: 1 + 2,
              cards: cards,
              lastIndex: index == -1 ? 0 : index,
            },
          });
        }
      }
    }
  }

  return (
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
            title={"Flashcards"}
          />
        </LAView>
      </LAView>
      <div className=" mt-2 card p-2 sm:p-2 md:p-4 lg:p-4 w-full">
        {FLASH_CARD_MENU &&
          FLASH_CARD_MENU?.map((ele, idx) => {
            
            const isSelected = selectedMenu.includes(ele.title);

            if (isSubscribe && ele?.free_model == 1) {
              return null;
            }
            if (ele?.requires_subscription == true && isSubscribe == false && (ele?.key === "exam" || ele?.key === "all_cards")) { //for all flashcards and exam essentials
              const menuImage = ele?.image;
              const menuBg = ele?.icon_bg;
              //const item = {id: ele.topic_ids[0]}
              //const noOfQue = getQuestionCount(item);
              return (
                <div
                key={idx + 1}
                className="p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg mb-2"
              >
                <div className="w-full">
                  <button
                    className="flex w-full items-center justify-between "
                    onClick={() => navigate("/chooseplan")}
                  >
                    <div className="gap-2 flex items-center my-1 ">
                      {menuImage && (
                        <div
                          className="mx-2 p-2 rounded-md"
                          style={{ backgroundColor: menuBg }}
                        >
                          <img
                            src={menuImage}
                            alt="menuImage"
                            width={25}
                            height={25}
                            className=""
                          />
                        </div>
                      )}
                    
                    <p
                      className="text-left text-base text-gray-800 dark:text-gray-50 lg:text-lg md:text-lg font-semibold pb-3 pt-2"
                      
                    >
                      {ele?.title} <br />
                      {/* <span style={{ fontSize: "1rem", fontWeight: "normal", color: theme?.THEME_TEXT_GRAY }}>{noOfQue}  Flashcards</span> */}
                    </p>
                    </div>
                    <img src={SVG_IMAGES?.Lock} />
                  </button>
                </div>
                </div>
              );

               
            }

            return (
              <div
                key={idx + 1}
                className="p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg mb-2"
              >
                <CollapseItem
                  id={idx}
                  defaultOpenId={3}
                  title={ele?.title}
                  menuBg={ele?.icon_bg}
                  menuImage={ele?.image}
                  openItemId={openItemId}
                  setOpenItemId={setOpenItemId}
                  className={"w-full "}
                  left={ele?.left}
                  link={ele?.link}
                  isExpanded={isSelected}
                  onClick={() => {
                    if (ele?.menu) {
                      if (isSelected) {
                        let selected = [...selectedMenu];
                        selected = selected.filter((menu) => menu != ele.title);
                        setSelectedMenu(selected);
                      } else {
                        let selected = [...selectedMenu];
                        selected.push(ele.title);
                        setSelectedMenu(selected);
                      }
                    } else {
                      
                      onPressItem(ele, idx);
                    }
                  }}
                >
                  {ele?.menu
                    ? ele?.menu?.map((subElement, idx) => {
                        const no_of_que = getQuestionCount(subElement);
                        return (
                          <CollapseSubItem
                            key={subElement?.id + 4}
                            id={subElement?.id}
                            title={subElement?.domain_name}
                            noOfQue={
                              ele?.free_model == 1 && subElement?.num_flashcards
                                ? subElement?.num_flashcards
                                : no_of_que
                            }
                            type="Flashcards"
                            openItemId={
                              subElement?.visibility ? subOpenItemId : null
                            }
                            setOpenItemId={setSubOpenItemId}
                            className={
                              "w-full border-t border-gray-200 dark:border-gray-600 pt-2"
                            }
                            visibility={
                              ele?.free_model
                                ? false
                                : subElement?.requires_subscription == true &&
                                  isSubscribe == false
                            }
                            onClick={() => SubElementChoose(subElement, ele)}
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

      {isProgressQuestion && (
        <BookMarkPopup
          title={`${STRINGS.flashcards}`}
          message={STRINGS.flashcard_message}
          cancelText={STRINGS?.cancel}
          options={[STRINGS.start_from_beginning, STRINGS.resume_from_stopped]}
          onCancel={() => {
            setProgressQuestion(false);
          }}
          onPressOptions={async (index) => {
            if (index === 0) {
              setSelectedTopicBookmark(null);
              onAction(index);
            } else if (index === 1) {
              setSelectedTopicBookmark(null);
              onAction(index);
            }
            setProgressQuestion(false);
          }}
        />
      )}
      {isExamProgressQuestion && (
        <BookMarkPopup
          title={STRINGS.flashcard}
          message={STRINGS.flashcard_message}
          cancelText={STRINGS?.cancel}
          options={[STRINGS.start_from_beginning, STRINGS.resume_from_stopped]}
          onCancel={() => {
            setExamProgressQuestion(false);
          }}
          onPressOptions={async (index) => {
            setExamProgressQuestion(false);

            if (index === 0) {
              setSelectedTopicBookmark(null);
              onActionExam(index);
            } else if (index === 1) {
              setSelectedTopicBookmark(null);
              onActionExam(index);
            }
          }}
        />
      )}
      {isProgressBookmark && (
        <BookMarkPopup
          title={STRINGS.study_questions}
          message={STRINGS.flashcard_message}
          cancelText={STRINGS?.cancel}
          options={[STRINGS.start_from_beginning, STRINGS.resume_from_stopped]}
          onCancel={() => {
            setProgressBookmark(false);
          }}
          onPressOptions={async (index) => {
            setProgressBookmark(false);
            if (index === 0) {
              setSelectedTopicBookmark(null);
              onActionBookmark(index);
            } else if (index === 1) {
              setSelectedTopicBookmark(null);
              onActionBookmark(index);
            }
          }}
        />
      )}
    </LAView>
  );
};

export default FlashCards;
