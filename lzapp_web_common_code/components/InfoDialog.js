import React from 'react';

const InfoDialog = ({ isOpen, title, description, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-800 dark:bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        <div className="mb-4 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: description }}></div>
        
        <div className="flex justify-end space-x-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg transition ${action.className}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;