import React from 'react';

/**
 * VolumeLicensingBanner component
 * A banner that promotes volume licensing options for teams and organizations
 * 
 * @returns {JSX.Element} The VolumeLicensingBanner component
 */
const VolumeLicensingBanner = () => {
  const licensesUrl = process.env.REACT_APP_FIREBASE_PROJECT === 'learnzapp-test' 
    ? 'https://licenses-test.learnzapp.com'
    : 'https://licenses.learnzapp.com';

  return (
    <div className="max-w-4xl mx-auto my-8 relative">
      {/* Floating NEW pill */}
      <div className="absolute -top-3 left-10 z-10">
        <div className="bg-lz-orange text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg border-2 border-white">
          NEW!
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-lg border-2 border-lz-blue bg-lz-blue-1 dark:bg-lz-blue-9/40">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="mr-4 text-lz-blue dark:text-lz-blue-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-lz-blue dark:text-lz-blue-2">Need 5+ licenses?</h3>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Save up to <span className="font-bold text-lz-blue dark:text-lz-blue-2">55%</span> with Volume Licensing for teams and organizations
            </p>
          </div>
        </div>
        <a
          href={licensesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-lz-blue hover:bg-lz-blue-7 text-white font-bold rounded-md transition-all duration-300"
        >
          Explore Volume Pricing
        </a>
      </div>
    </div>
  );
};

export default VolumeLicensingBanner; 