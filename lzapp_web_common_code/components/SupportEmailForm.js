import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { BundleContext } from "../context/BundleProvider";
import { IS_BUNDLE_APP, BUNDLE_APP_NAME, GET_APP_NAME } from '../../app_constant';

const SupportEmailForm = ({ handleCloseDialog, isLoading, setLoading }) => {
  const { bundleData, profile } = useContext(AuthContext);
  const [thankYouMessage, setThankYouMessage] = useState(false);
  const authEmail = IS_BUNDLE_APP ? bundleData?.auth_email ?? '' : profile?.auth_email ?? '';
  const name = `${bundleData?.auth_first_name ?? ""} ${bundleData?.auth_last_name ?? ""}`.trim();
  const bundleAppName = BUNDLE_APP_NAME;
  const { selectedCertificate } = useContext(BundleContext);
  const appNameForCollection = GET_APP_NAME(selectedCertificate);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg border-2 shadow-lg w-full max-w-md mx-4">
        <button
          onClick={handleCloseDialog}
          className="absolute top-2 right-4 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <span className="text-3xl text-gray-500 dark:text-gray-300">&times;</span>
        </button>
        {thankYouMessage ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-lz-blue">Thank You!</h3>
            <p className="text-sm text-gray-800 dark:text-gray-200">Your message has been sent successfully.</p>
          </div>
        ) : (
          <div>
            <iframe
              src={`https://www.learnzapp.com/contact_form.html?name=${name}&auth_email=${authEmail}&bundle_app_name=${bundleAppName}&app_name_for_collection=${appNameForCollection}`}
              width="100%"
              height="400"
              frameBorder="0"
              onLoad={() => setLoading(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportEmailForm;
