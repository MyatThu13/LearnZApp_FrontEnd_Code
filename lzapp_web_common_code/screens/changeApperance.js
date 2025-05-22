import React, { useContext, useState } from "react";
import { LAText, LAView } from "../components";
import BackArrowIcon from "../components/BackArrowIcon";
import { ThemeContext } from "../context/ThemeProvider";
import { useNavigate } from "react-router-dom";

const ChangeApperance = () => {
  const { theme, currentTheme, setCurrentTheme } = useContext(ThemeContext);
  const navigation = useNavigate();
  const Theme = localStorage.getItem("Theme") || "light";
  const [isSelect, setIsSelect] = useState(Theme === "light" ? 1 : 2);

  const onChangeAppreance = (id) => {
    const body = document.body;
    if (id === 1) {
      localStorage.setItem("Theme", "light");
      setCurrentTheme("light");
      setIsSelect(1);
      body.classList.remove("dark");
    } else if (id === 2) {
      localStorage.setItem("Theme", "dark");
      body.classList.add("dark");
      setIsSelect(2);
      setCurrentTheme("dark");
    }
  };

  return (
    <>
      <LAView flex="row" className="mb-3 flex items-center px-[24px]">
        <button
          className="rounded-lg border-2 border-[#000] dark:border-[#fff] px-2 py-2"
          onClick={() => {
            navigation(-1);
          }}
        >
          <BackArrowIcon color={Theme === "light" ? "#101010" : "#fff"} />
        </button>
        <LAView flex="col" className="flex-1 mx-6">
          <div className="flex items-center justify-between">
            <LAText
              className="flex line-clamp-1 truncate"
              size="medium"
              font="600"
              color={"black"}
              title={"App Appearance"}
            />
          </div>
        </LAView>
      </LAView>
      <LAView flex="col" className="flex-1 mx-6 pt-4">
        {[
          {
            id: 1,
            mode: "Always Light",
            message: "This app will always use a light app appearance",
          },
          {
            id: 2,
            mode: "Always Dark",
            message: "This app will always use a Dark app appearance",
          },
        ].map((modeItem) => {
          let { id, mode, message } = modeItem;
          const isSelectedItem = id === isSelect;
          return (
            <div
              key={id}
              className="flex justify-between border px-2 py-2 mb-2 items-center rounded"
              style={
                Theme === "light"
                  ? { borderColor: `${theme?.THEME_LIGHT}` }
                  : { borderColor: "#FFF" }
              }
            >
              <div>
                <p
                  style={{
                    color: `${Theme === "light" ? "#101010" : "#fff"}`,
                    fontWeight: "600",
                  }}
                >
                  {mode}
                </p>
                <p style={{ color: `${theme?.THEME_TEXT_GRAY}` }}>{message}</p>
              </div>
              <div onClick={() => onChangeAppreance(id)}>
                {!isSelectedItem ? (
                  <svg
                    stroke="currentColor"
                    fill={Theme === "light" ? theme?.THEME_DARK : "#fff"}
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"></path>
                  </svg>
                ) : (
                  <svg
                    stroke="currentColor"
                    fill={Theme === "light" ? theme?.THEME_DARK : "#fff"}
                    strokeWidth="0"
                    viewBox="0 0 24 24"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 9h6v6H9z"></path>
                    <path d="M19 17V7c0-1.103-.897-2-2-2H7c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2zM7 7h10l.002 10H7V7z"></path>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </LAView>
    </>
  );
};

export default ChangeApperance;
