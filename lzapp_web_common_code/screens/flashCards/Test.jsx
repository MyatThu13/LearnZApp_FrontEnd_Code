import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import { SVG_IMAGES } from "../../assets";
import { BundleContext } from "../../context/BundleProvider";
import { GET_APP_DOMAIN_LIST } from "../../../app_constant";
import HTMLContent from "../../components/HTMLContent";

const FlashCardTest = ({ item, isVisible, onViewMore, title }) => {
  const { theme } = useContext(ThemeContext);

  const { selectedCertificate } = useContext(BundleContext);
  function getTopicId() {
    const APP_DOMAIN_LIST = GET_APP_DOMAIN_LIST(selectedCertificate);
    const array = APP_DOMAIN_LIST.find((e) => e.id == item?.topic_id);
    return array?.domain_name ?? "";
  }
  const topicName = getTopicId();

  return (
    <div
      className="relative w-full   rounded-2xl mt-4 mb-10"
      style={{ background: `${theme?.THEME_DARK}`, minHeight: "180px" }}
    >
      <div className="relative h-full">
        
          <HTMLContent htmlContent={item?.title} style={{ marginBottom:'10px', color: '#FFFFFF' }}  className="text-center text-lg pt-8 pb-2 mb-4"/>
        
        <img className="absolute top-0 left-0" src={SVG_IMAGES?.Circle1} />
        <img className="absolute top-0 left-0" src={SVG_IMAGES?.Circle2} />
        <img className="absolute top-0 right-0" src={SVG_IMAGES?.Circle3} />
        {isVisible === true && (
          <>
            <div className="border-b border lg:mx-8 md:mx-8 sm:mx-2 mx-2  "></div>
            <div className="flex flex-col items-center justify-between relative w-full">
            <HTMLContent htmlContent={item?.desc} style={{ color: '#FFFFFF' }}  className="text-center pt-8 pb-2 mb-4"/>
              
            </div>
          </>
        )}
        {isVisible === true && topicName !== "" && (
          <div className="w-full text-center pt-4">
          
            <h3 className = "text-center w-full text-sm italic text-gray-100 dark:text-gray-400 mb-6"
            style={{
              display: 'inline-block', // Aligns the bullet with the text
              position: 'relative', // Needed for pseudo-element positioning
            }}>
              {topicName}
              
            </h3>
          </div>
        
        
        )}
      </div>
      {isVisible === false && (
        <div className="w-full flex justify-center  absolute bottom-0 ">
          <button
            type={"simple"}
            className="-mb-4 px-4 py-2 shadow rounded"
            // style={styles.slideButton}
            onClick={() => onViewMore()}
            style={{
              background: `${theme?.TABBAR_BACKGROUND}`,
              color: `${theme?.THEME_TEXT_BLACK}`,
            }}
          >
            Show Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCardTest;
