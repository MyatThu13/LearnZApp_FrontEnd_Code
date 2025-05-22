import React from 'react';
import { formatTime } from '../constant/utils';

const PracticeTestDialog = ({ isOpen, onClose, onStart, onChoosePlan, testDetails, isSubscribe }) => {
    if (!isOpen) return null;

    const { is_custom_test, test_name, test_time, total_time, num_questions, requires_subscription } = testDetails;
    

    let questions = num_questions;
    let testName = test_name;
    //let timeLimit = test_time / 60 ;
    const formattedTimeLimit = formatTime(test_time);
    const formattedTotalTime = formatTime(total_time*60);
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
          <h2 className="text-xl font-bold mb-4 dark:text-white">{testName}</h2>
          {is_custom_test ? (
            <>
              <p className="mb-4 dark:text-gray-200">
                Your questions are being selected to improve your readiness by presenting questions you haven't encountered before, along with questions from areas where you need further practice. The questions are generated from the domains you have selected.
              </p>
            </>
          ) : (
            <p className="mb-4 dark:text-gray-200">
              This is a preset test that will have the same questions every time you take the test. Take the test more often to see how you are progressing.
            </p>
          )}
          {(is_custom_test && total_time > 0) ? (
            <p className="mb-4 dark:text-gray-200">
            This test has time limit of <span className="text-lz-blue font-semibold">{formattedTotalTime}</span>. Make sure you have time to finish the test. Only by finishing the test will you see your performance and affect your readiness score. To emulate a real test, you will not be able to pause the test.
            </p>
          ) : (
            <p className="mb-4 dark:text-gray-200">
              This test has <span className="text-lz-blue font-semibold">{questions} questions</span> and the time limit is <span className="text-lz-blue font-semibold">{formattedTimeLimit}</span>. Make sure you have time to finish the test. Only by finishing the test will you see your performance and affect your readiness score. To emulate a real test, you will not be able to pause the test.
            </p>
          )}
          {requires_subscription && !isSubscribe ? (
            <>
              <p className="mb-4 text-red-600 dark:text-red-400">
                This test is part of the premium plan.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={onChoosePlan}
                  className="px-4 py-2 bg-lz-blue text-white rounded-lg hover:bg-lz-orange transition"
                >
                  See Plans
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={onStart}
                className="px-4 py-2 bg-lz-blue text-white rounded-lg hover:bg-lz-orange transition"
              >
                Start Test
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PracticeTestDialog;