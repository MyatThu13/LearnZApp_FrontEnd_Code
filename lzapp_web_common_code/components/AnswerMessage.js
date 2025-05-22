import React from 'react';


const AnswerMessage = ({ correct_answer, selected_answer }) => {
    const isMultipleChoice = Array.isArray(correct_answer);
    const cleanedSelectedAnswers = Array.isArray(selected_answer) ? selected_answer.filter(answer => answer !== 'X') : selected_answer;
    const sortedSelectedAnswers = Array.isArray(cleanedSelectedAnswers) ? [...cleanedSelectedAnswers].sort() : cleanedSelectedAnswers;
    const sortedCorrectAnswers = isMultipleChoice ? [...correct_answer].sort() : correct_answer;

    const isCorrectAnswer = () => {
        if (isMultipleChoice) {
            if (sortedCorrectAnswers.length !== sortedSelectedAnswers.length) {
                return false;
            }
            for (let i = 0; i < sortedCorrectAnswers.length; i++) {
                if (sortedCorrectAnswers[i] !== sortedSelectedAnswers[i]) {
                    return false;
                }
            }
            return true;
        } else {
            return correct_answer === selected_answer;
        }
    };

    const didNotAnswer = () => {
        if (Array.isArray(selected_answer)) {
            return selected_answer.length === 1 && selected_answer[0] === 'X';
        } else {
            return selected_answer === 'X';
        }
    };

    return (
        <div className="p-0 my-0 mx-0 rounded-lg">
            {didNotAnswer() ? (
                <p className="font-semibold text-black dark:text-gray-500 text-lg leading-6">
                    You did not answer this question.
                </p>
            ) : isCorrectAnswer() ? (
                <p className="font-semibold text-green-500 text-lg leading-6">
                    Great job! You got it right.
                </p>
            ) : (
                <div>
                <p className="font-semibold text-red-600 text-lg leading-6">
                    Not quite! 
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                        {`That wasn't the right answer.\nYou selected \"${Array.isArray(sortedSelectedAnswers) ? sortedSelectedAnswers.join(', ') : sortedSelectedAnswers}\", but the correct answer is \"${Array.isArray(sortedCorrectAnswers) ? sortedCorrectAnswers.join(', ') : sortedCorrectAnswers}\"`}
                </p>
                </div>
            )}
        </div>
    );
};

export default AnswerMessage;