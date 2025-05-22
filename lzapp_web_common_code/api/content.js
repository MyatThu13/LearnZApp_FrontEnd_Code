// This file is used to decrypt the content of the acronyms, glossary, flashcards, and questions

import {
    BUNDLE_ACRONYMS,
    BUNDLE_GLOSSARY,
    BUNDLE_FLASHCARDS,
    BUNDLE_QUESTIONS,
  } from "../../content";
  import _ from "lodash";
  import CryptoJS from "crypto-js";
  
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  
  export const GET_ACRONYMS = (SELECTED_BUNDLE) => {
    const encryptedAcronyms = BUNDLE_ACRONYMS[SELECTED_BUNDLE];
    if (!encryptedAcronyms || _.isEmpty(encryptedAcronyms)) {
      console.log('No valid bundle selected or acronyms available for:', SELECTED_BUNDLE);
      return []; 
    }
    const bytes = CryptoJS.AES.decrypt(encryptedAcronyms, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const acronymsArray = JSON.parse(decryptedText);
      return acronymsArray;
    } catch (e) {
      console.error("Acronyms data corrupted:", e);
      return [];
    }
  };
  
  export const GET_GLOSSARY = (SELECTED_BUNDLE) => {
    const encryptedGlossary = BUNDLE_GLOSSARY[SELECTED_BUNDLE];
    if (!encryptedGlossary || _.isEmpty(encryptedGlossary)) {
      console.log('No valid bundle selected or glossary available for:', SELECTED_BUNDLE);
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedGlossary, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const glossaryArray = JSON.parse(decryptedText);
      return glossaryArray;
    } catch (e) {
      console.error("Glossary data corrupted:", e);
      return [];
    }
  };
  
  export const GET_FLASHCARDS = (SELECTED_BUNDLE) => {
    const encryptedFlashcards = BUNDLE_FLASHCARDS[SELECTED_BUNDLE];
    if (!encryptedFlashcards) {
      console.log('No valid bundle selected or flashcards available for:', SELECTED_BUNDLE);
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedFlashcards, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const flashcardsArray = JSON.parse(decryptedText);
      return flashcardsArray;
    } catch (e) {
      console.error("Flashcards data corrupted:", e);
      return [];
    }
  };

  export const GET_OLD_FLASHCARDS = (SELECTED_BUNDLE) => {
    const encryptedFlashcards = BUNDLE_FLASHCARDS["cissp_old"];
    if (!encryptedFlashcards) {
      console.log('No valid bundle selected or flashcards available for: cissp_old');
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedFlashcards, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const flashcardsArray = JSON.parse(decryptedText);
      return flashcardsArray;
    } catch (e) {
      console.error("Flashcards data corrupted:", e);
      return [];
    }
  };
  
  export const GET_LOCAL_QUESTIONS = (SELECTED_BUNDLE) => {
    const encryptedQuestions = BUNDLE_QUESTIONS[SELECTED_BUNDLE];
    if (!encryptedQuestions) {
      console.log('No valid bundle selected or questions available for:', SELECTED_BUNDLE);
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedQuestions, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const questionsArray = JSON.parse(decryptedText);
      return questionsArray;
    } catch (e) {
      console.error("Questions data corrupted:", e);
      return [];
    }
  };

  export const GET_OLD_QUESTIONS = (SELECTED_BUNDLE) => {
    const encryptedQuestions = BUNDLE_QUESTIONS["cissp_old"] || [];
    if (!encryptedQuestions) {
      console.log('No valid bundle selected or questions available for: cissp_old');
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedQuestions, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const questionsArray = JSON.parse(decryptedText);
      return questionsArray;
    } catch (e) {
      console.error("Questions data corrupted:", e);
      return [];
    }
  };
  