import React, { useContext, useState } from 'react';

import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import { BundleContext } from "../context/BundleProvider";
import UpdateCISSPData from '../api/UpdateCISSPData';
import { IMAGES } from '../assets';
import { RESET_USER_QUESTIONS_COLLECTION } from '../api/questions';


const UpdateNotification = () => {
  const { theme } = useContext(ThemeContext);
  const { profile, questionsList, updateReadinessScore, addFlashcardProgress, addQuestionProgress, setNewProfile } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleUpdateData = async () => {
    setIsLoading(true);
    try {
      await UpdateCISSPData(profile, questionsList, updateReadinessScore, addFlashcardProgress, addQuestionProgress);
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('Data update failed:', error);
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleResetConfirmation = () => {
    setShowResetModal(true);
  };

  const handleCancelReset = () => {
    setShowResetModal(false);
  };

  const handleConfirmReset = async () => {
    setShowResetModal(false);
    await resetData();
  };

  async function resetData() {
    try {
        await RESET_USER_QUESTIONS_COLLECTION()

        const data = {
            auth_first_name: profile?.auth_first_name ?? '',
            auth_last_name: profile?.auth_last_name ?? '',
            auth_email: profile?.auth_email ?? '',
            auth_login_provider: profile?.auth_login_provider ?? '',
            last_signin_time: profile?.last_signin_time ?? '',
            flashcard_bookmarks: [],
            flashcards_progress: [],
            practice_test_history: [],
            question_bookmarks: [],
            questions_progress: [],
            quiz_of_the_day_reminder: true,
            signup_date: profile?.signup_date ?? '',
            study_plan_reminder: true,
            profile_pic: '',
            readiness_scores: null,
            score_progress: {},
            isQuestionLatestVersionUpdated: true,
        }
        setNewProfile(data)

       

        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    catch (error) {
        console.log(error)
    }

}

  return (
    <div className={`bg-white dark:bg-gray-900 min-h-screen p-4`}>
      {/* <div className="flex justify-center mb-4">
        <img className="h-8 w-36" src={IMAGES.logo_prepare} alt="Logo" />
      </div> */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        {/* <p className="text-center text-gray-600 dark:text-gray-300 mb-6">{authEmail}</p> */}
        <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">Important Update: CISSP Exam Content Changes</h2>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
          We’ve enhanced the content in this app to help you prepare for the 2024 Version of the CISSP Certification Exam. Here’s what you need to know:
        </p>
        <h3 className="text-xl font-bold mb-2 dark:text-white">What's New</h3>
        
        <ul className="list-inside mb-4 mx-4">
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            We’ve added, removed, and modified questions and flashcards to reflect the latest CISSP exam objectives, ensuring your study material is always current.
          </li>
        </ul>
        <h3 className="text-xl font-bold mb-2 dark:text-white">Impact on Your Data</h3>
        <ul className="list-inside mb-4 mx-4">
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            <strong>Practice Tests:</strong> Your previous practice test scores may be affected by these changes, providing you with the most accurate readiness assessment.
          </li>
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            <strong>Bookmarks:</strong> Some of your bookmarked questions may be updated or removed to align with the new objectives, keeping your study material relevant.
          </li>
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            <strong>Readiness Score:</strong> Your readiness score will recalibrate with the updated content, giving you a true reflection of your current preparation level.
          </li>
        </ul>
        <h3 className="text-xl font-bold mb-2 dark:text-white">Choose an option:</h3>
        <ul className="list-inside mb-4 mx-4">
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            <strong>Update My Data:</strong> Automatically recalculate your readiness score and update your practice test history and bookmarks to match the new content.
          </li>
          <li className="text-base text-gray-600 dark:text-gray-300 mb-2">
            <strong>Reset and Start Over:</strong> Begin fresh with the updated content by resetting all your data.
          </li>
        </ul>
        <h3 className="text-xl font-bold mb-2 dark:text-white">Why This Matters</h3>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
          We’re committed to providing you with the highest quality study materials, keeping you prepared and confident for your CISSP exam. Our continuous updates ensure that you have access to the latest information, reflecting the most recent changes in exam objectives.
        </p>
        <div className="flex justify-between mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={handleUpdateData}>
            Update My Data
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={handleResetConfirmation}>
            Reset and Start Over
          </button>
        </div>
      </div>

      
        <Modal isOpen={isLoading}>
        <div className="flex flex-col items-center justify-center">
        <div className="mt-10 loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
          <h2 className="text-large font-bold text-center mt-10 mb-10 dark:text-white">Updating your content and data to get you ready for the latest CISSP exam prep...</h2>
          
          </div>
        </Modal>
      

      <Modal isOpen={showSuccess} onClose={handlePopupClose}>
        <div>
          <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">Data Update Successful!</h2>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4 text-center">
            Your data has been updated successfully. You can now continue using the app with the latest content.
          </p>
          <div className="flex justify-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={handlePopupClose}>
              OK
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showResetModal} onClose={handleCancelReset}>
        <div>
          <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">CISSP Exam Content Changes</h2>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4 text-center">
            Are you sure you want to reset all your data? Your readiness score will be reset to 0.
          </p>
          <div className="flex justify-between mt-6">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition" onClick={handleCancelReset}>
              Cancel
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={handleConfirmReset}>
              Yes, Reset Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const Modal = ({ isOpen, children, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-75 flex justify-center items-center z-50">
        <div className="relative bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
          {children}
        </div>
      </div>
    );
  };

export default UpdateNotification;