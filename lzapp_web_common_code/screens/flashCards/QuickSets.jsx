import React, { useContext, useEffect, useState } from "react";
import { LAText, LAView } from "../../components";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { STRINGS } from "../../constant";
import { useLocation, useNavigate } from "react-router-dom";
import FlashCardTest from "./Test";
import { AuthContext } from "../../context/AuthProvider";
import { ThemeContext } from "../../context/ThemeProvider";
import BackArrowIcon from "../../components/BackArrowIcon";
import BookmarkIcons from "../../components/BookmarkIcons";
import TabFooter from "../../components/TabFooter";

const QuickSets = () => {
  const { theme, currentTheme } = useContext(ThemeContext);

  const currentIndex = 0;
  const { state } = useLocation();
  const title = state?.title ?? STRINGS.flashcards;
  const lastIndex = state?.lastIndex ?? 0;
  const set_id = state?.set_id ?? "";

  let cards = state?.cards || [];
  const navigation = useNavigate();
  const {
    profile,
    addFlashcardToBookmark,
    removeFlashcardFromBookmark,
    addFlashcardProgress,
  } = useContext(AuthContext);

  const [activeIndex, setActiveIndex] = useState(lastIndex);
  const [selectedIndex, setSelectedIndex] = useState(null);

  function onNext() {
    const nextIndex = activeIndex + 1;
    if (cards.length > nextIndex) {
      setActiveIndex(nextIndex);
    }
  }

  function onPrevious() {
    const nextIndex = activeIndex - 1;
    if (nextIndex >= 0) {
      setActiveIndex(nextIndex);
    }
  }

  function onBookmark() {
    if (cards.length > activeIndex) {
      const card = cards[activeIndex];
      if (isBookmark) {
        // trackFlashcardBookmark(-1)
        removeFlashcardFromBookmark(card.id);
      } else {
        // trackFlashcardBookmark(1)
        addFlashcardToBookmark(card.id);
      }
    }
  }

  useEffect(() => {
    //if (activeIndex > 0) {
      // trackFlashcardRecord();
      if (set_id && cards.length > activeIndex) {
        const card = cards[activeIndex];
        addFlashcardProgress(set_id, card.id);
      }
    //}
  }, [activeIndex]);

  

  function checkBookmark() {
    if (cards.length > activeIndex) {
      const card = cards[activeIndex];
      return profile?.flashcard_bookmarks?.includes(card.id) ?? false;
    }

    return false;
  }

  function onSnap(index) {
    setActiveIndex(index);
  }
  const isBookmark = checkBookmark();

  useEffect(() => {
    setSelectedIndex(null);
  }, [activeIndex]);

  return (
    <LAView className="relative w-full" type="">
      <div className="page-heading mx-4 my-4">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => navigation(-1)}
            className="h-10 w-10 flex items-center justify-center border-2 rounded-lg"
          >
            <BackArrowIcon
              color={currentTheme === "light" ? "#101010" : "#fff"}
            />
          </button>

          <LAText
            className="flex line-clamp-1 truncate "
            size="medium"
            font="600"
            color={"black"}
            title={title}
          />
        </div>

        {title !== "Bookmark" || cards?.length > 0 ? (
          <>
            {" "}
            <div className="my-2 mx-12 flex items-center justify-between border-b border-dashed pb-3">
              <h4
                className="text-lg font-semibold "
                style={{ color: `${theme?.THEME_LIGHT} ` }}
              >
                {`${STRINGS.flashcard} ${activeIndex + 1}`}
                <span
                  className="text-base font-normal "
                  style={{ color: `${theme?.THEME_TEXT_BLACK}` }}
                >
                  &nbsp; / {`${cards.length}`}
                </span>
              </h4>
              <div onClick={() => onBookmark()}>
                <BookmarkIcons
                  isBookmark={isBookmark}
                  currentTheme={currentTheme}
                />
              </div>
            </div>
            <FlashCardTest
              item={cards[activeIndex]}
              isVisible={selectedIndex == activeIndex}
              onViewMore={() => {
                setSelectedIndex(activeIndex);
              }}
              title={title}
            />
            <TabFooter
              activeIndex={activeIndex}
              theme={theme}
              questionArrayaLength={cards?.length}
              onNext={onNext}
              onPrevious={onPrevious}
              upgradePlan="Flashcards"
            />
          </>
        ) : (
          <>
            <LAView className="px-[24px] pt-20 ">
              <div className="w-full flex flex-col justify-center items-center h-[50vh]">
                <img src={IMAGES.ic_tab_bookmark} width={60} className="pb-6" />
                <h5 className="text-gray-400">{STRINGS.no_question_boomark}</h5>
              </div>
            </LAView>
          </>
        )}
      </div>
    </LAView>
  );
};

export default QuickSets;
