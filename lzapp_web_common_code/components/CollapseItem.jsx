import React, { useContext } from "react";
import { useCollapse } from "react-collapsed";
import { ThemeContext } from "../context/ThemeProvider";
import LAText from "./LAText";
import { SVG_IMAGES } from "../assets";

const CollapseItem = ({
  id,
  title,
  menuImage,
  menuBg,
  onClick,
  children,
  openItemId,
  setOpenItemId,
  className,
  arrowRight,
  isExpanded,
}) => {
  const { getCollapseProps } = useCollapse({
    isExpanded,
  });
  const { theme } = useContext(ThemeContext);
  return (
    <div className={className} onClick={onClick}>
      <button
        className="flex w-full items-center justify-between "
        onClick={() => setOpenItemId(isExpanded ? null : id)}
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
            className="text-base lg:text-lg md:text-lg font-semibold pb-3 pt-2 text-gray-800 dark:text-gray-50"
          >
            {title}
          </p>
        </div>
        {!arrowRight ? (
          <LAText
            className={`text-[${theme?.THEME_TEXT_BLACK}]`}
            size="small"
            font="600"
            color={"black"}
            title={"❯"}
          />
        ) : (
          <>
            {isExpanded ? (
              <LAText
                className={`text-[${theme?.THEME_TEXT_BLACK}] rotate-90	`}
                size="small"
                font="600"
                color={"black"}
                title={"❯"}
              />
            ) : (
              <LAText
                className={`text-[${theme?.THEME_TEXT_BLACK}] rotate-[30]	`}
                size="small"
                font="600"
                color={"black"}
                title={"❯"}
              />
            )}
          </>
        )}
      </button>
      <div {...getCollapseProps({})}>{isExpanded ? children : null}</div>
    </div>
  );
};

export default CollapseItem;
