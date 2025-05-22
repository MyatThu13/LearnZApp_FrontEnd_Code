import React, { Suspense, useEffect, useState } from "react";
import { lazy } from "react";
import {
  Route,
  Routes,
} from "react-router-dom";
import Prepare from "../screens/prepare";
import Leading from "../screens/leading";
import Login from "../screens/login";
import Signup from "../screens/signup";
// import ChoosePlan from "../screens/choosePlans";
import ForgotPassword from "../screens/forgotPassword";
import TestReview from "../screens/testReview";
import QuestionReview from "../screens/questionReview";
import Profile from "../screens/profile";
import Account from "../screens/account";
import TestSetting from "../screens/testSetting";
import OtherApps from "../screens/otherApps";
import HelpAndSupport from "../screens/helpAndSupport";
import MainLayout from "./layout/MainLayout";
import Glossary from "../screens/glossary";
// import Acronyms from "../screens/acronyms";
import StudyQuestion from "../screens/studyQuestion";
import QuickSet from "../screens/quickSet";
import PracticeTest from "../screens/practiceTest";
import FlashCards from "../screens/flashCards";
import Bookmarks from "../screens/flashCards/BookMarks";
import QuickSets from "../screens/flashCards/QuickSets";
import CustomTestBuilder from "../screens/customTestBuilder";
// import Home from "../screens/home";
import Dashboard from "../screens/dashboard";
import History from "../screens/history";
import Bookmark from "../screens/bookmark";
import Test from "../screens/test";
import MainBookmark from "../screens/MainBookmark";
import FlashCardExam from "../screens/flashCards/FlashCardExam";
import ChangeApperance from "../screens/changeApperance";
import { auth } from "../api/config";
import PrepareBundle from "../screens/prepareBundle";
import { IS_BUNDLE_APP } from "../../app_constant";
import Loader from "./loader";
import Questions from "../screens/studyQuestion/questions";
import UpdateReadinessScore from "../screens/UpdateReadinessScore";
import UpdateAllQuestions from "../screens/UpdateAllQuestions";

const Acronyms = lazy(() => import("../screens/acronyms"));
const Home = lazy(() => import("../screens/home"));
const ChoosePlan = lazy(() => import("../screens/choosePlans"));

const PageRouter = () => {
  const [user, setUser] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  // console.log(location, "location constole");
  // const user = auth().currentUser?.uid || null;
  // console.log(user, "logged in user");
  // console.log(auth().currentUser, "logged in auth user");

  const handleReload = () => {
    setIsReloading(true);
    // window.location.reload();
    // setTimeout(() => {
    //   setIsReloading(false);
    // }, 2000);
  };

  useEffect(() => {
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user === null) {
        setUser(false);
      } else {
        setUser(user);
      }
    });
    window.addEventListener("beforeunload", handleReload);
    // Cleanup the subscription when the component unmounts
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <>
      {isReloading ? (
        <Loader />
      ) : (
        <>
          {!user && (
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* <Route path="/" element={<Leading />} /> */}
                <Route path="*" element={<Leading />} />
                <Route path="/leading" element={<Leading />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                {/* <Route
                  path="/choosePlan"
                  element={isReloading ? <Loader /> : <ChoosePlan />}
                /> */}
                <Route path="/forgot_password" element={<ForgotPassword />} />
                <Route
                  path="/prepare"
                  element={
                    IS_BUNDLE_APP ? (
                      <PrepareBundle handleReload={handleReload} />
                    ) : (
                      <Prepare />
                    )
                  }
                />
              </Routes>
            </Suspense>
          )}

          {user && (
            <>
              {isReloading ? (
                <Loader />
              ) : (
                <Suspense fallback={<Loader />}>
                  <Routes>
                    <Route
                      path="/prepare"
                      element={
                        IS_BUNDLE_APP ? (
                          <PrepareBundle handleReload={handleReload} />
                        ) : (
                          <Prepare />
                        )
                      }
                    />
                    <Route
                      path="/updaterediness"
                      element={<UpdateReadinessScore />}
                    />
                    <Route
                      path="/updateallquestions"
                      element={<UpdateAllQuestions />}
                    />

                    {/* <Route
                      path="/choosePlan"
                      element={isReloading ? <Loader /> : <ChoosePlan />}
                    /> */}
                    {/* <Route
                  path="*"
                  element={
                    selectedBundle && isReloading ? <Loader /> : <ChoosePlan />
                  }
                /> */}
                    <Route element={<MainLayout />}>
                      <Route
                        path="/choosePlan"
                        element={isReloading ? <Loader /> : <ChoosePlan />}
                      />
                      {/* <Route
                        path="/volumePurchase"
                        element={<VolumePurchase />}
                      /> */}
                      <Route path="/testReview" element={<TestReview />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/appearance" element={<ChangeApperance />} />
                      <Route path="/testSetting" element={<TestSetting />} />
                      <Route path="/otherApps" element={<OtherApps />} />
                      <Route
                        path="/helpAndSupport"
                        element={<HelpAndSupport />}
                      />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/acronymns" element={<Acronyms />} />
                      <Route
                        path="/studyQuestion"
                        element={<StudyQuestion />}
                      />
                      <Route path="/quick" element={<QuickSet />} />
                      <Route path="/practicetest" element={<PracticeTest />} />
                      <Route path="/flashcard" element={<FlashCards />} />
                      <Route
                        path="/flashcard/bookmark"
                        element={<Bookmarks />}
                      />
                      <Route path="/flashcard/quick" element={<QuickSets />} />
                      <Route
                        path="/flashcard/questions"
                        element={<QuickSets />}
                      />
                      <Route
                        path="/flashcard/exam"
                        element={<FlashCardExam />}
                      />
                      <Route
                        path="/customtest"
                        element={<CustomTestBuilder />}
                      />
                      {/* <Route path="/home" element={<Tabbar />} /> */}
                      <Route path="/home" element={<Home />} />
                      <Route path="*" element={<Home />} />
                      <Route
                        path="/studyquestions/:id"
                        element={<Questions />}
                      />
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/Bookmark" element={<MainBookmark />} />
                      <Route
                        path="/Bookmark/questions"
                        element={<Bookmark />}
                      />
                      <Route path="/test" element={<Test />} />
                      <Route
                        path="/questionReview"
                        element={<QuestionReview />}
                      />
                    </Route>
                  </Routes>
                </Suspense>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PageRouter;
