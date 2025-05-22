import React, { useContext } from "react";
import { SVG_IMAGES } from "../assets";
import { useCollapse } from "react-collapsed";
import { ThemeContext } from "../context/ThemeProvider";

const CollapseSubItem = ({
  id,
  title,
  noOfQue,
  type,
  children,
  openItemId,
  setOpenItemId,
  className,
  visibility,
  onClick,
}) => {
  const isExpanded = openItemId === id;
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

        <p
          className="text-left text-base lg:text-lg md:text-lg font-normal"
          style={{ color: theme?.THEME_TEXT_BLACK, marginLeft: "50px" }}
        >
          {title} <br />
          <span style={{ fontSize: "1rem", fontWeight: "normal", color: theme?.THEME_TEXT_GRAY }}>{noOfQue} {type}</span>
        </p>

        {!visibility ? (
          <>
            {isExpanded ? (
              <img src={SVG_IMAGES?.DownArrow} />
            ) : (
              <>

                <p
                  className="text-left text-base lg:text-lg md:text-lg font-semibold"
                  style={{ fontSize: "1.5rem", color: theme?.THEME_TEXT_BLACK, marginRight: "25px" }}
                >
                  &gt;</p>
              </>
            )}
          </>
        ) : (
          <img src={SVG_IMAGES?.Lock} />
        )}
      </button>
      <div {...getCollapseProps({})}>{isExpanded && children}</div>
    </div>
  );
};

export default CollapseSubItem;
