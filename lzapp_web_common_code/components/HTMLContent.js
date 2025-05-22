// HTMLContent.js
import React, { useState } from "react";
import { useContext } from "react";
import Modal from "react-modal";
import { ThemeContext } from "../context/ThemeProvider";

// Assuming you have set up your modal component
const ImageModal = ({ isOpen, onRequestClose, imgSrc }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(zoom + 10);
  };

  const handleZoomOut = () => {
    if (zoom > 100) setZoom(zoom - 10);
  };

  const customStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)", // Center the modal
      maxWidth: "80%", // Limit modal width to prevent full-width stretch
      maxHeight: "80%", // Limit modal height to allow for scrolling
      overflow: "auto", // Enable scrolling for overflow content
      resize: "both", // Allow the modal to be resized
      boxSizing: "border-box", // Include padding in width and height calculations
      padding: "20px", // Space around the image/content
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Dimmed background for focus
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <img
        src={imgSrc}
        style={{ width: "100%", height: "auto" }}
        alt="Modal Content"
      />
    </Modal>
  );
};

const HTMLContent = ({ index, htmlContent, style = {}, className = "" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");
  const { theme } = useContext(ThemeContext);
  

  const handleContentClick = (e) => {
    if (e.target.tagName === "IMG") {
      setSelectedImageSrc(e.target.src);
      setIsModalOpen(true);
    }
  };

  // Merge default styles with styles provided via props
  const combinedStyles = {
    color: theme?.THEME_TEXT_BLACK_LIGHT,
    ...style, // this will override default styles if there are conflicts
  };

  // Merge default class names with class names provided via props
  const combinedClassNames = `text-base/loose font-normal ${className}`;

  return (
    <div>
      <div
        key={index}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        onClick={handleContentClick}
        style={combinedStyles}
        className={combinedClassNames}
      />
      <ImageModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        imgSrc={selectedImageSrc}
      />
    </div>
  );
};

export default HTMLContent;
