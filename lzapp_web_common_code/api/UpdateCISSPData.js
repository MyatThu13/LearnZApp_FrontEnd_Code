import React, { useContext } from 'react';
import { firestore } from "../api/config";
import { auth } from "../api/config";
// import { GET_LOCAL_QUESTIONS, GET_SCORE_QUESTIONS, DELETE_QUESTION, SAVE_FLASHCARD_BOOKMARK, SAVE_QUESTION_BOOKMARK, SAVE_TEST_HISTORY, UPDATE_USER_NEW_CISSP_TAG, GET_FLASHCARDS } from '../../api';
import { GET_APP_DOMAIN_LIST, GET_APP_NAME_FOR_COLLECTION } from "../../app_constant";
import { GET_FLASHCARDS, GET_LOCAL_QUESTIONS, GET_OLD_QUESTIONS, GET_OLD_FLASHCARDS } from './content';
import { GET_SCORE_QUESTIONS, SAVE_QUESTION_BOOKMARK } from './questions';
import { SAVE_FLASHCARD_BOOKMARK } from './flashcard';
import { SAVE_TEST_HISTORY } from './practice';
import { UPDATE_USER_NEW_CISSP_TAG } from './firebase_user';


async function UpdateCISSPData(profile, questionsList, updateReadinessScore, addFlashcardProgress, addQuestionProgress) {

    const APP_NAME = 'CISSP';
    const selectedCertificate = 'cissp';
     
    try {
        console.log('Updating data for app:', APP_NAME);
        await deleteQuestionAndCalculateReadinessScore();
        await removeDeletedBookmarkForFlashcard();
        await removeDeletedBookmarkForQuestions();
        await updateFlashcardProgressForSet()
        await updateQuestionsProgressForSet()
        await updatePracticeTest();
        await updateTagForNewVersion(); 
    } catch (error) {
        console.error('Data update failed:', error);
        throw error; // Rethrow the error to handle it in the caller function
    } 

    async function deleteQuestionAndCalculateReadinessScore() {
        await deleteAllQuestions();
        await calculateReadinessScore();
    }

    async function deleteAllQuestions() {
        try {
            const userUid = auth().currentUser.uid;
    
            //console.log(`Deleting questions for app: ${APP_NAME}, user: ${userUid}`);
    
            const questionsQuerySnapshot = await firestore()
                .collection('apps')
                .doc(APP_NAME)
                .collection('users')
                .doc(userUid)
                .collection('questions')
                .get();
    
            //console.log(`Found ${questionsQuerySnapshot.size} questions in Firestore`);
    
            const batch = firestore().batch();
            questionsQuerySnapshot.forEach(documentSnapshot => {
                if (!questionsList?.find((que) => que.id == documentSnapshot.id)) {
                    //console.log(`Deleting question with ID: ${documentSnapshot.id}`);
                    batch.delete(documentSnapshot.ref);
                }
            });
    
            //console.log('Committing batch delete');
            await batch.commit();
    
            //console.log('Batch delete committed successfully');
        } catch (error) {
            console.error('Error deleting questions:', error);
            throw error;
        }
    }

    async function calculateReadinessScore() {
        //console.log('Calculating readiness score');
        const QUESTIONS_LIST = GET_LOCAL_QUESTIONS(selectedCertificate);
        const domains = GET_APP_DOMAIN_LIST(selectedCertificate);
        const result = await GET_SCORE_QUESTIONS();
        const data = {
            questionsList: QUESTIONS_LIST,
            app_domains: domains,
            scores: result?.data
        };
        updateReadinessScore(data);
    }

    async function removeDeletedBookmarkForFlashcard() {
        //console.log('Removing deleted bookmarks for flashcards');
        const bookmarks = profile?.flashcard_bookmarks;
        const flashcards = GET_FLASHCARDS(selectedCertificate);
        const updatedBookmarks = bookmarks.filter((e) => flashcards.find((card) => card.id == e));
        await SAVE_FLASHCARD_BOOKMARK(updatedBookmarks);

        const flashcardProgress = profile?.flashcards_progress?.find((e) => e.flashcard_set_id == 'bookmark');
        if (flashcardProgress) {
            const last_seen_flashcard_id = flashcardProgress?.last_seen_flashcard_id;
            if (!updatedBookmarks.includes(last_seen_flashcard_id)) {
                const index = bookmarks.indexOf(last_seen_flashcard_id);
                if (index >= 0) {
                    if (index < updatedBookmarks?.length) {
                        addFlashcardProgress('bookmark', updatedBookmarks[index]);
                    } else {
                        addFlashcardProgress('bookmark', updatedBookmarks[updatedBookmarks?.length - 1]);
                    }
                }
            }
        }
    }

    async function removeDeletedBookmarkForQuestions() {
        //console.log('Removing deleted bookmarks for questions');
        const bookmarks = profile?.question_bookmarks;
        const QUESTIONS_LIST = GET_LOCAL_QUESTIONS(selectedCertificate);
        const updatedBookmarks = bookmarks.filter((e) => QUESTIONS_LIST.find((que) => que.id == e));
        await SAVE_QUESTION_BOOKMARK(updatedBookmarks);

        const questionProgress = profile?.questions_progress?.find((e) => e.study_questions_set_id == 'bookmark');
        if (questionProgress) {
            const last_seen_question_id = questionProgress?.last_seen_question_id;
            if (!updatedBookmarks.includes(last_seen_question_id)) {
                const index = bookmarks.indexOf(last_seen_question_id);
                if (index >= 0) {
                    if (index < updatedBookmarks?.length) {
                        addQuestionProgress('bookmark', updatedBookmarks[index]);
                    } else {
                        addQuestionProgress('bookmark', updatedBookmarks[updatedBookmarks?.length - 1]);
                    }
                }
            }
        }
    }

    async function updateFlashcardProgressForSet() {
        //console.log('Updating flashcard progress for set');
        const domains = GET_APP_DOMAIN_LIST(selectedCertificate);
        const flashcards = GET_FLASHCARDS(selectedCertificate);

        domains.forEach((e) => {
            const setID = e.id + 2

            const flashcardProgress = profile?.flashcards_progress?.find((e) => e.flashcard_set_id == setID);
            if (flashcardProgress) {
                /** HERE YOU NEED TO GET OLD FLASHCARD LIST INSTEAD OF OLD QUESTIONS */
                const OLD_FLASHCARDS = GET_OLD_FLASHCARDS(selectedCertificate) 
                const OLD_FLASHCARD_OF_TOPIC = OLD_FLASHCARDS.filter((card) => card.topic_id == e.id)

                const last_seen_flashcard_id = flashcardProgress?.last_seen_flashcard_id;
                if (!flashcards?.find((que) => que.id == last_seen_flashcard_id)) {
                    let index = OLD_FLASHCARD_OF_TOPIC.findIndex((card) => card.id == last_seen_flashcard_id);
                    let previousFlashcardID = null;
    
                    while (index > 0) {
                        index -= 1;
                        previousFlashcardID = OLD_FLASHCARD_OF_TOPIC[index]?.id;
                        if (flashcards.find((car) => car.id == previousFlashcardID)) {
                            break;
                        }
                        previousFlashcardID = null;
                    }
    
                    if (previousFlashcardID) {
                        //console.log(`Updating progress: setID = ${setID}, flashcardID = ${previousFlashcardID}`);
                        addFlashcardProgress(setID, previousFlashcardID);
                    } else {
                        console.warn('No valid previous flashcard found to update progress.');
                    }
                }
            }
        })
    }

    async function updateQuestionsProgressForSet() {
        //console.log('Updating questions progress for set');
        const domains = GET_APP_DOMAIN_LIST(selectedCertificate);
    
        domains.forEach((e) => {
            const setID = e.id + 2;
    
            const questionProgress = profile?.questions_progress?.find((prog) => prog.study_questions_set_id == setID);
            //console.log('Question Progress:', questionProgress);
    
            if (questionProgress) {
                const OLD_QUESTIONS = GET_OLD_QUESTIONS(selectedCertificate);
                const OLD_QUESTION_OF_TOPIC = OLD_QUESTIONS.filter((ques) => ques.topic_id == e.id);
    
                const last_seen_question_id = questionProgress?.last_seen_question_id;
                //console.log('Last Seen Question ID:', last_seen_question_id);
    
                if (!questionsList?.find((que) => que.id == last_seen_question_id)) {
                    let index = OLD_QUESTION_OF_TOPIC.findIndex((ques) => ques.id == last_seen_question_id);
                    let previousQuestionID = null;
    
                    while (index > 0) {
                        index -= 1;
                        previousQuestionID = OLD_QUESTION_OF_TOPIC[index]?.id;
                        if (questionsList.find((que) => que.id == previousQuestionID)) {
                            break;
                        }
                        previousQuestionID = null;
                    }
    
                    if (previousQuestionID) {
                        //console.log(`Updating progress: setID = ${setID}, questionID = ${previousQuestionID}`);
                        addQuestionProgress(setID, previousQuestionID);
                    } else {
                        console.warn('No valid previous question found to update progress.');
                    }
                }
            }
        });
    }

    async function updatePracticeTest() {
        //console.log('Updating practice test');
        const allTests = profile?.practice_test_history ?? [];
        const updateTests = await Promise.all(allTests.map(async (item) => {
          const testQuestions = item?.test_questions_meta_data ?? [];
          const updatedQuestions = await updateQuestions(testQuestions);
          const correct = updatedQuestions.filter((e) => e.response === 'CORRECT');
          const incorrect = updatedQuestions.filter((e) => e.response === 'INCORRECT');
          const unanswered = updatedQuestions.filter((e) => e.response === 'UNANSWERED');
      
          return {
            correct: correct.length,
            date: item?.date || new Date(),
            incorrect: incorrect.length,
            is_new_app_test: item?.is_new_app_test || false,
            score: parseInt((100 * correct.length) / updatedQuestions.length, 10),
            remaining_time: item?.remaining_time || 0,
            test_name: item?.test_name || 'Practice Test',
            test_questions_meta_data: updatedQuestions,
            time_taken: item?.time_taken || 0,
            total: updatedQuestions.length,
            total_time: item?.total_time || 0,
            unanswered: unanswered.length,
          };
        }));
        //console.log('Updated tests:', updateTests)
      
        // Save all updated tests
        await SAVE_TEST_HISTORY(updateTests);
      }
      
      async function updateQuestions(testQuestions) {
        const updatedQuestions = [];
        const OLD_QUESTIONS = GET_OLD_QUESTIONS(selectedCertificate);
      
        for (const testQ of testQuestions) {
          const currentQuestion = questionsList?.find((que) => que.id === testQ.question_id);
          if (currentQuestion) {
            if (testQ.selected_choice === 'X' || Array.isArray(testQ.selected_choice)) {
              updatedQuestions.push(testQ);
            } else if (Array.isArray(currentQuestion.correct_answer)) {
              const oldQuestion = OLD_QUESTIONS.find((que) => que.id === testQ.question_id);
              if (oldQuestion && !Array.isArray(oldQuestion.correct_answer)) {
                const selectedChoice = oldQuestion[`choice_${testQ.selected_choice.toLowerCase()}`];
                updatedQuestions.push({
                  question_id: testQ.question_id,
                  response: testQ.response,
                  selected_choice: selectedChoice.split(', '),
                  topic_id: testQ.topic_id
                });
              } else {
                updatedQuestions.push(testQ);
              }
            } else {
              updatedQuestions.push(testQ);
            }
          }
        }
      //console.log('Updated questions:', updatedQuestions);
        return updatedQuestions;
      }

    async function updatePracticeTest_old() {
        //console.log('Updating practice test');
        const allTests = profile?.practice_test_history ?? [];

        const updateTests = [];

        (allTests ?? []).forEach((item) => {
            //get all question of test
            const testQuestions = item?.test_questions_meta_data ?? []

            //get question ids of all question into array
            const allQuestionIds = testQuestions.map((e) => e.question_id)

            //update all deleted question with latest question
            var updatedQuestions = []
            testQuestions.forEach((testQ) => {
                if (questionsList?.find((que) => que.id == testQ.question_id)) {
                    if (testQ?.selected_choice == 'X' || Array.isArray(testQ?.selected_choice)) {
                        updatedQuestions.push(testQ)
                    }
                    else {
                        //GET CURRENT QUESTION
                        const currentQuestion = questionsList?.find((que) => que.id == testQ.question_id)
                        if (Array.isArray(currentQuestion?.correct_answer)) {
                            console.log(testQ.question_id)

                            //GET OLD QUESTION
                            const OLD_QUESTIONS = GET_OLD_QUESTIONS(selectedCertificate)
                            const oldQuestion = (OLD_QUESTIONS ?? []).find((que) => que.id == testQ.question_id)

                            if (testQ.question_id == 2078) { console.log(oldQuestion) }
                            if (!Array.isArray(oldQuestion?.correct_answer)) { // new is array, old is not
                                const selectedChoice = oldQuestion[`choice_${testQ?.selected_choice?.toLowerCase()}`]
                                if (testQ.question_id == 2078) { console.log(selectedChoice) }
                                const quesUpdate = {
                                    question_id: testQ.question_id,
                                    response: testQ.response,
                                    selected_choice: selectedChoice.split(', '),
                                    topic_id: testQ.topic_id
                                }
                                if (testQ.question_id == 2078) { console.log(quesUpdate) }
                                updatedQuestions.push(quesUpdate)
                            }
                            else {
                                updatedQuestions.push(testQ)
                            }
                        }
                        else {
                            updatedQuestions.push(testQ)
                        }
                    }
                }
            })

            //update test history with latest questions
            const correct = updatedQuestions.filter((e) => e.response == 'CORRECT')
            const incorrect = updatedQuestions.filter((e) => e.response == 'INCORRECT')
            const unanswered = updatedQuestions.filter((e) => e.response == 'UNANSWERED')

            
            const updatedTestItems = {
                correct: correct?.length,
                date: item?.date,
                incorrect: incorrect?.length,
                is_new_app_test: item?.is_new_app_test,
                score: parseInt((100 * correct?.length) / updatedQuestions?.length),
                remaining_time: item?.remaining_time,
                test_name: item?.test_name,
                test_questions_meta_data: updatedQuestions,
                time_taken: item?.time_taken,
                total: updatedQuestions?.length,
                total_time: item?.total_time,
                unanswered: unanswered?.length
            };

            updateTests.push(updatedTestItems)
        })

        //save all updated test
        await SAVE_TEST_HISTORY(updateTests)
    }

    async function updateTagForNewVersion() {
        //console.log('Updating tag for new version');
        const res = await UPDATE_USER_NEW_CISSP_TAG();
        return
    }
}

export default UpdateCISSPData;