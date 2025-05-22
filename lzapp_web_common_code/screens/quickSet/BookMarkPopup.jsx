import React, { useContext } from "react";
import { LAText, LAView } from "../../components";
import { STRINGS } from "../../constant";
import { IMAGES, SVG_IMAGES } from "../../assets";
import { ThemeContext } from "../../context/ThemeProvider";

const BookMarkPopup = ({
  title,
  message,
  cancelText,
  options,
  onCancel,
  onPressOptions,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    
      
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
          <button
            className="absolute right-4 top-4"
            onClick={() => onCancel()}
          >
            <img className="w-4 h-4" src={IMAGES.ic_cancel} />
          </button>
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            {title}{" "}
          </h2>

        <span className="text-gray-600 text-base pb-4 text-center">
          {message}
        </span>

        
        <div className="flex justify-end space-x-4 mt-6">
        <button
                        onClick={() => onPressOptions(0)}
                        className="px-4 py-2 rounded-lg transition bg-lz-blue text-white hover:bg-lz-orange"
                      >
                        {STRINGS?.start_from_beginning}
                      </button>
        <button
                        onClick={() => onPressOptions(1)}
                        className="px-4 py-2 rounded-lg transition bg-lz-blue text-white hover:bg-lz-orange"
                      >
                        {STRINGS?.resume_from_stopped}
                      </button>
                      
          
          
        </div>
      </div>
      </div>
  );
};

export default BookMarkPopup;
