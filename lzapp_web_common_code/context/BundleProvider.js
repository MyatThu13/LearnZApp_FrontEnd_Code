import React, { createContext, useState, useEffect, useContext } from "react";

//CONSTANT
import { USER_DEAFULT_KEY } from "../constant/event";

//API
import { SET_CERTIFICATE_NAME } from "../api/firebase_user";

export const BundleContext = createContext();

export const BundleProvider = (props) => {
  const [selectedCertificate, setSelectedCertificate] = useState("");

  useEffect(() => {
    // Use a function to initialize the state from local storage
    const getSelectedBundle = async () => {
      const result = localStorage.getItem(
        USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS
      );
      setSelectedCertificate(result || ""); // Set to an empty string if result is falsy
    };

    getSelectedBundle();
  }, []);

  async function setSelectedBundle(key) {
    localStorage.setItem(USER_DEAFULT_KEY.SAVED_BUNDLE_DETAILS, key);
    await SET_CERTIFICATE_NAME(key);
    setSelectedCertificate(key);
    return;
  }

  return (
    <BundleContext.Provider
      value={{
        selectedCertificate,
        setSelectedBundle,
      }}
    >
      {props.children}
    </BundleContext.Provider>
  );
};
