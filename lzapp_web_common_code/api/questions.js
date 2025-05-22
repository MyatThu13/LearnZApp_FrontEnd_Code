//CONSTANT
import { GET_APP_NAME_FOR_COLLECTION } from "../../app_constant";

//CONTENT
import { GET_LOCAL_QUESTIONS } from "./content";

//PACKAGES
import { auth, firestore } from "./config";
import _ from "lodash";

const collection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore()
    .collection("apps")
    .doc(APP_NAME)
    .collection("users")
    .doc(auth().currentUser.uid);
};

async function SAVE_QUESTION_BOOKMARK(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      question_bookmarks: data,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPLOAD_QUESTION() {
  const QUESTIONS = GET_LOCAL_QUESTIONS();
  for (let index in QUESTIONS) {
    let question = QUESTIONS[index];
    try {
      const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
      firestore()
        .collection("apps")
        .doc(APP_NAME)
        .collection("questions")
        .doc()
        .set(question);
    } catch (e) {
      console.error(e);
    }
  }
}

async function SAVE_QUESTION_PROGRESS(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      questions_progress: data,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_SCORE_QUESTIONS() {
  //console.log("GET_SCORE_QUESTIONS");
  //console.log("NODE_ENV", process.env.NODE_ENV);
  try {
    const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
    const result = await firestore()
      .collection("apps")
      .doc(APP_NAME)
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("questions")
      .get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.documentID = documentSnapshot.id;
      list.push(data);
    });
    return { status: true, data: list, error: "", isExist: list.length > 0 };
  } catch (error) {
    return { status: false, data: [], error: error.message };
  }
}

async function SAVE_QUESTION(data) {
  try {
    const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
    const result = await firestore()
      .collection("apps")
      .doc(APP_NAME)
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("questions")
      .doc(data.question_id.toString())
      .get();
    if (result.exists) {
      await firestore()
        .collection("apps")
        .doc(APP_NAME)
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("questions")
        .doc(data.question_id.toString())
        .update(data);
    } else {
      await firestore()
        .collection("apps")
        .doc(APP_NAME)
        .collection("users")
        .doc(auth().currentUser.uid)
        .collection("questions")
        .doc(data.question_id.toString())
        .set(data);
      return { status: true, error: "" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function RESET_USER_QUESTIONS_COLLECTION() {
  try {
    const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
    const result = await firestore()
      .collection("apps")
      .doc(APP_NAME)
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("questions")
      .get();
    // Get all users
    const batch = firestore().batch();

    result.forEach((documentSnapshot) => {
      batch.delete(documentSnapshot.ref);
    });

    batch.commit();
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function SAVE_SCORE_PROGRESS(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      score_progress: data,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function SAVE_PROGRESS_DASHBOARD(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      readiness_scores: data,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

export {
  SAVE_QUESTION_BOOKMARK,
  SAVE_QUESTION_PROGRESS,
  // SAVE_QUESTION_SCROE,
  SAVE_PROGRESS_DASHBOARD,
  SAVE_SCORE_PROGRESS,
  UPLOAD_QUESTION,
  SAVE_QUESTION,
  GET_SCORE_QUESTIONS,
  RESET_USER_QUESTIONS_COLLECTION,
};
