import React, { useContext } from 'react';
import HTMLContent from './HTMLContent'; 
import { ThemeContext } from "../context/ThemeProvider"; 

const ExplanationComponent = ({ explanation, topic, sub_domain }) => {
  const { theme } = useContext(ThemeContext); // Use theme context

  return (
    <div className="pt-6">
      <div>
      <div className="my-2 flex items-center justify-between border-b border-dashed pb-2">
        <h3 className="font-semibold text-lg" style={{ color: theme?.THEME_TEXT_BLACK }}>
          Explanation:
        </h3>
        </div>
        <HTMLContent htmlContent={explanation ?? ""} />
      </div>
      <div className="w-full text-center pt-4">
        <div
            className="mx-auto py-4 px-6 rounded shadow-lg"
            style={{
                background: `${theme?.THEME_INPUT_BACKGROUND}`,
                color: `${theme?.THEME_TEXT_BLACK}`,
                width: '50%'
            }}
        >
          <h4 style={{
            fontSize: "medium",
            fontWeight: 'normal', 
            color: theme?.THEME_TEXT_BLACK,
            marginBottom: '0.5rem', // Space between topic and subdomain
          }}>
            {topic}
          </h4>
          {sub_domain && (
            <span style={{
              display: 'block', // Subdomain on its own line
              fontStyle: "italic",
              fontSize: "small",
              color: theme?.THEME_TEXT_GRAY,
            }}>
              {sub_domain}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplanationComponent;
