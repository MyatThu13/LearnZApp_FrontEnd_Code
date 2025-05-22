import { auth } from "./config";

async function INIT_FIREBASE_APP() {
  // if (Platform.OS == 'android') {
  //   firebase.firestore().settings({
  //     persistence: true
  //   })
  // }
}

async function SIGN_UP_FIREBASE(email, password) {
  try {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    return { status: true, data: result, error: "" };
  } catch (error) {
    return authError(error);
  }
}

async function SIGN_IN_FIREBASE(email, password) {
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return { status: true, data: result, error: "" };
  } catch (error) {
    return authError(error);
  }
}

async function FIREBASE_UPDATE_PASSWORD(password) {
  try {
    const result = await auth().currentUser.updatePassword(password);
    return { status: true, data: result, error: "" };
  } catch (error) {
    return authError(error);
  }
}

async function SIGN_IN_GOOGLE() {
  try {
    const provider = new auth.GoogleAuthProvider();
    // const { idToken } = await GoogleSignin.signIn();
    // const googleCredential = auth.GoogleAuthProvider.credential();
    // const result = await auth().signInWithCredential(googleCredential);
    const result = await auth().signInWithPopup(provider);
    return { status: true, data: result, error: "" };
  } catch (error) {
    if (true) {
      return { status: false, data: null, error: null };
    } else {
      return { status: false, data: null, error: error.message };
    }
  }
}

async function SIGN_UP_APPLE() {
  try {
    const provider = new auth.OAuthProvider("apple.com");
    const result = await auth().signInWithPopup(provider);
    return { status: true, data: result, error: "" };
  } catch (err) {
    if (true) {
      return { status: false, data: null, error: null };
    } else {
      return { status: false, data: null, error: err.message };
    }
  }
}

// async function SIGN_IN_APPLE() {
//   try {
//     const appleAuthRequestResponse = await appleAuth.performRequest({
//       requestedOperation: appleAuth.Operation.LOGIN,
//       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
//     });

//     if (!appleAuthRequestResponse.identityToken) {
//       return {
//         status: false,
//         data: null,
//         error: "Apple Sign-In failed - no identify token returned",
//       };
//     }

//     const { identityToken, nonce, fullName } = appleAuthRequestResponse;
//     const appleCredential = auth.AppleAuthProvider.credential(
//       identityToken,
//       nonce
//     );
//     var result = await auth().signInWithCredential(appleCredential);
//     result.firstName = fullName.givenName;
//     result.lastName = fullName.familyName;
//     return { status: true, data: result, error: "" };
//   } catch (error) {
//     return { status: false, data: null, error: error.message };
//   }
// }

function authError(error) {
  if (error.code === "auth/email-already-in-use") {
    return { status: false, data: null, error: "That email address in use" };
  } else if (error.code == "auth/user-not-found") {
    return {
      status: false,
      data: null,
      error: "There is no user record corresponding to this identifier",
    };
  } else if (error.code === "auth/invalid-email") {
    return {
      status: false,
      data: null,
      error: "That email address is invalid!",
    };
  } else if (error.code == "auth/wrong-password") {
    return { status: false, data: null, error: "Password incorrect" };
  } else if (error.code == "auth/requires-recent-login") {
    return {
      status: false,
      data: null,
      error:
        "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
    };
  } else {
    return { status: false, data: null, error: error.message };
  }
}

export {
  INIT_FIREBASE_APP,
  SIGN_UP_FIREBASE,
  SIGN_IN_FIREBASE,
  SIGN_IN_GOOGLE,
  FIREBASE_UPDATE_PASSWORD,
  SIGN_UP_APPLE,
};
