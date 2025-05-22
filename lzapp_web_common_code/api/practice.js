//CONSTANT
import { GET_APP_NAME_FOR_COLLECTION } from "../../app_constant";
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

async function SAVE_TEST_HISTORY(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      practice_test_history: data,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function DELETE_TEST_HISTORY(data) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      practice_test_history: firestore.FieldValue.arrayRemove(data),
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

export { SAVE_TEST_HISTORY, DELETE_TEST_HISTORY };
