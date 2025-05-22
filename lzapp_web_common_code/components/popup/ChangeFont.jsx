import React, { useContext } from "react";
import LAView from "../LAView";
import { ThemeContext } from "../../context/ThemeProvider";

const ChangeFont = (props) => {

  const { theme } = useContext(ThemeContext)
  return (
    <LAView
      type=""
      className="min-h-screen absolute top-0  left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-[600] "
    >
      <div className={`text-[${theme?.THEME_TEXT_BLACK}] border p-2 rounded-md w-fit`} style={{ color: `${theme?.THEME_TEXT_BLACK}` }}>
        Aa | Aa
      </div>
    </LAView>
  );
};

export default ChangeFont;
