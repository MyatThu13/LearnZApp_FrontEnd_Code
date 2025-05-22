import React from 'react';

const ReadinessScoreImpact = ({ lastReadinessScoreInt, profileReadinessScoreInt }) => {
    if (!lastReadinessScoreInt || lastReadinessScoreInt === profileReadinessScoreInt) {
        return null;
    }

    const isIncrease = lastReadinessScoreInt < profileReadinessScoreInt;
    const changeText = isIncrease
        ? `Your overall readiness score increased by ${profileReadinessScoreInt - lastReadinessScoreInt}% to ${profileReadinessScoreInt}%`
        : `Your overall readiness score decreased by ${lastReadinessScoreInt - profileReadinessScoreInt}% to ${profileReadinessScoreInt}%`;

    return (
        <div className="flex flex-row items-center justify-center mt-2 mx-6 p-4 rounded-lg bg-lz-blue-1 dark:bg-lz-blue-10">
            <div className={`flex items-center justify-center h-12 w-12 mr-4 ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {isIncrease ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                )}
            </div>
            <p className={`text-lg font-medium ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                {changeText}
            </p>
        </div>
    );
};

export default ReadinessScoreImpact;