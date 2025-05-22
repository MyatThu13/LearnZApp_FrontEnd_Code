import React from "react";

const BookmarkIcons = ({ isBookmark, currentTheme }) => {
  return (
    <div>
      {" "}
      {!isBookmark ? (
        <svg
          stroke={currentTheme === "light" ? "#101010" : "#fff"}
          fill={currentTheme === "light" ? "#101010" : "#fff"}
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="24px"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 3.75C5 2.784 5.784 2 6.75 2h10.5c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 0 1-1.218.586L12 17.21l-5.781 4.625A.75.75 0 0 1 5 21.25Zm1.75-.25a.25.25 0 0 0-.25.25v15.94l5.031-4.026a.749.749 0 0 1 .938 0L17.5 19.69V3.75a.25.25 0 0 0-.25-.25Z"></path>
        </svg>
      ) : (
        <svg
          stroke="currentColor"
          fill="red"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="24px"
          width="24px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6.69 2h10.56c.966 0 1.75.784 1.75 1.75v17.5a.75.75 0 0 1-1.218.585L12 17.21l-5.781 4.626A.75.75 0 0 1 5 21.253L4.94 3.756A1.748 1.748 0 0 1 6.69 2Z"></path>
        </svg>
      )}
    </div>
  );
};

export default BookmarkIcons;
