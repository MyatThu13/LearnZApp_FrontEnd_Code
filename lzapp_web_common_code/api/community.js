//CONSTANT
import {
  BUNDLE_APP_NAME,
  GET_APP_NAME_FOR_COLLECTION,
  IS_BUNDLE_APP,
} from "../../app_constant";

//PACKAGES
import { auth, firestore } from "./config";

const collectionBundle = async () => {
  return firestore().collection("apps").doc(BUNDLE_APP_NAME);
};

const collection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore().collection("apps").doc(APP_NAME);
};

const app_config_collection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore()
    .collection("apps")
    .doc(APP_NAME)
    .collection("APP")
    .doc("CONFIG");
};

const community_collection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore()
    .collection("apps")
    .doc(APP_NAME)
    .collection("community_data");
};

async function GET_QUESTIONS() {
  try {
    const question_collection = await collection();
    const result = await question_collection.collection("questions").get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.documentID = documentSnapshot.id;
      list.push(data);
    });
    return { status: true, data: list, error: "" };
  } catch (error) {
    return { status: false, data: [], error: error.message };
  }
}

async function GET_COMMUNITY_DATA() {
  try {
    const question_collection = await collection();
    const result = await question_collection.get();
    return { status: true, data: result.data(), error: "" };
  } catch (error) {
    return { status: false, data: [], error: error.message };
  }
}

async function GET_COMMUNITY_SINGLE_QUESTION_DETAILS(id) {
  try {
    const community_collection_obj = await community_collection();
    const result = await community_collection_obj.doc(`${id}`).get();
    if (result.exists) {
      return { status: true, data: result.data(), error: "" };
    } else {
      return { status: true, data: null, error: "" };
    }
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

async function GET_COMMUNITY_MULTIPLE_QUESTION_DETAILS(ids) {
  try {
    const community_collection_obj = await community_collection();
    const result = await community_collection_obj.get();

    var array = [];
    result.forEach((documentSnapshot) => {
      if (ids.includes(documentSnapshot.id)) {
        array.push({
          ...documentSnapshot.data(),
        });
      }
    });

    return { status: true, data: array, error: "" };
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

async function UPDATE_COMMUNITY_DATA(data) {
  const community_collection_obj = await community_collection();
  const result = await community_collection_obj
    .doc(`${data.question_id}`)
    .get();
  if (result.exists) {
    const previousData = result.data();
    const times_answered = previousData.times_answered + 1;
    const times_answered_correct =
      previousData.times_answered_correct + (data.correct ? 1 : 0);
    community_collection_obj.doc(`${data.question_id}`).update({
      question_id: data.question_id,
      times_answered: times_answered,
      times_answered_correct: times_answered_correct,
    });
  } else {
    community_collection_obj.doc(`${data.question_id}`).set({
      question_id: data.question_id,
      times_answered: 1,
      times_answered_correct: data.correct ? 1 : 0,
    });
  }
}

async function UPDATE_SUBSCRIPTION(data) {
  if (IS_BUNDLE_APP) {
    try {
      const collection_user = await collectionBundle();
      await collection_user
        .collection("subscriptions")
        .doc(auth().currentUser.uid)
        .set(data);
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  } else {
    try {
      const collection_user = await collection();
      await collection_user
        .collection("subscriptions")
        .doc(auth().currentUser.uid)
        .set(data);
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  }
}

async function GET_APP_CONFIG() {
  try {
    const collection_user = await app_config_collection();
    const result = await collection_user.get();
    if (result.exists) {
      return { status: true, data: result.data(), error: "" };
    } else {
      return { status: true, data: result.data(), error: "" };
    }
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

export {
  GET_COMMUNITY_DATA,
  GET_COMMUNITY_SINGLE_QUESTION_DETAILS,
  GET_COMMUNITY_MULTIPLE_QUESTION_DETAILS,
  UPDATE_COMMUNITY_DATA,
  GET_QUESTIONS,
  UPDATE_SUBSCRIPTION,
  GET_APP_CONFIG,
};
