import { useContext, useState } from "react";
import { IMAGES } from "../assets";

//COMPONENTS
import {
  LATextInput,
  LAButton,
  LAView,
  LAText,
} from "../components";

//CONSTANTS
import { STRINGS } from "../constant";

//PACKAGES
import { useNavigate } from "react-router-dom";
import { MixpanelContext } from "../context/MixpanelProvider";
import { auth } from "../api/config";
import { SHOW_TOAST } from "../constant/utils";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import { emailRegex } from "../constant/utils";

function ForgotPassword() {
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { trackForgotPassword } = useContext(MixpanelContext);
  const navigation = useNavigate();

  async function onReset(value, { resetForm }) {
    try {
      setLoading(true);
      await auth().sendPasswordResetEmail(value?.email);
      setLoading(false);
      setDialogOpen(true);
      trackForgotPassword();
    } catch (error) {
      setLoading(false);
      SHOW_TOAST(error.message, "error");
      resetForm();
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .matches(emailRegex, "Invalid email address")
      .required("Please enter email"),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-lz-blue dark:bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img src={IMAGES.logo_prepare} alt="LearnZapp" className="w-1/2 mx-auto" />
          <h1 className="text-2xl mt-4 dark:text-white">{STRINGS.forgot_password}</h1>
          <p className="text-gray-600 dark:text-gray-400">{STRINGS.enter_email_message}</p>
        </div>
        <Formik
          initialValues={{ email: "" }}
          enableReinitialize
          onSubmit={onReset}
          validationSchema={validationSchema}
        >
          {({
            values,
            errors,
            handleSubmit,
            handleBlur,
            handleChange,
            resetForm,
          }) => {
            return (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="relative w-full">
                    <img src={IMAGES.ic_email} alt="Email Icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.email}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-xs text-rose-500 mt-1"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full text-white py-4 rounded-lg bg-lz-blue hover:bg-lz-orange transition dark:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-900"
                  >
                    {STRINGS.reset}
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>

      {isDialogOpen && (
        <LADialog
          isOpen={isDialogOpen}
          onClose={() => {
            setDialogOpen(false);
            navigation("/login");
          }}
          title={STRINGS.reset_popup_title}
          description={STRINGS.reset_popup_message}
          buttons={[
            {
              text: "OK",
              onClick: () => {
                setDialogOpen(false);
                navigation("/login");
              },
            },
          ]}
        />
      )}
    </div>
  );
}

function LADialog({ isOpen, onClose, title, description, buttons }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
        <div className="flex justify-end space-x-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              className="px-4 py-2 rounded-lg bg-lz-blue hover:bg-lz-orange transition text-white dark:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-900"
              onClick={button.onClick}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
