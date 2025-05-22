import {
  BUNDLE_APP_NAME,
  GET_APP_NAME_FOR_COLLECTION,
  IS_BUNDLE_APP,
  THIRD_PARTY_CONFIG,
} from "../../app_constant";
import { auth, firestore, storage } from "./config";
import axios from "axios";
import getStripe from "./stripe";

const collectionBundle = async () => {
  return firestore()
    .collection("apps")
    .doc(BUNDLE_APP_NAME)
    .collection("users")
    .doc(auth().currentUser.uid);
};

const collection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore()
    .collection("apps")
    .doc(APP_NAME)
    .collection("users")
    .doc(auth().currentUser.uid);
};

const faqCollection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore().collection("apps").doc(APP_NAME).collection("FAQS");
};

const commonFaqs = async () => {
  return firestore().collection("apps").doc("COMMON_FAQS").collection("FAQS");
};

const otherAppCollection = () => {
  return firestore().collection("apps").doc("OTHER_APPS").collection("Apps").orderBy("id");;
};

const allUserCollection = async () => {
  const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
  return firestore().collection("apps").doc(APP_NAME).collection("users");
};

async function UPDATE_USER_PROFILE(result) {
  try {
    const collection_user = await collection();
    await collection_user.set(result);
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPDATE_BUNDLE_USER_PROFILE(result) {
  console.log("UPDATE_BUNDLE_USER_PROFILE", result)
  try {
    const collection_user = await collectionBundle();
    await collection_user.set(result);
    return { status: true, error: "" };
  } catch (error) {
    alert(error.message);
    return { status: false, error: error.message };
  }
}

async function GET_BUNDLE_PROFILE() {
  try {
    const collection_user = await collectionBundle();
    const result = await collection_user.get();
    if (result.exists) {
      return {
        status: true,
        data: result.data(),
        error: "",
        isUserExist: true,
      };
    } else {
      return { status: true, data: null, error: "", isUserExist: false };
    }
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

async function GET_USER_PROFILE() {
  try {
    const collection_user = await collection();
    const result = await collection_user.get();
    if (result.exists === true) {
      return {
        status: true,
        data: result?.data(),
        error: "",
        isUserExist: true,
      };
    } else {
      return { status: true, data: null, error: "", isUserExist: false };
    }
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

async function UPDATE_NOTIFICATION_SETTING(quiz, study) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      quiz_of_the_day_reminder: quiz,
      study_plan_reminder: study,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPDATE_PROFILE_DETAILS(first_name, last_name) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      auth_first_name: first_name,
      auth_last_name: last_name,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPDATE_USER_AUTH_DETAILS() {
  try {
    const collection_user = await collection();
    await collection_user.update({
      auth_email: auth().currentUser.email,
      auth_login_provider:
        auth().currentUser?.providerData[0]?.providerId ?? "",
      last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPDATE_BUNDLE_PROFILE_DETAILS(first_name, last_name) {
  try {
    const collection_user = await collectionBundle();
    await collection_user.update({
      auth_first_name: first_name,
      auth_last_name: last_name,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPLOAD_PROFILE(path) {
  // const blob = dataURLtoBlob(dataURL);
  // console.log("",blob);

  // var storageRef = storage.ref();

  // storageRef.put(path).then((snapshot) => {
  //   console.log(snapshot, "Uploaded a blob or file!");
  // });

  if (IS_BUNDLE_APP) {
    try {
      const user = auth()?.currentUser;

      if (!user) {
        throw new Error("User not authenticated");
      }

      const fileName = user.uid + ".jpg";

      const reference = storage()?.ref();

      if (!reference) {
        throw new Error("Storage reference not available");
      }

      const imageRef = reference.child(fileName);

      try {
        if (imageRef) {
          await imageRef.put(path);
        } else {
          throw new Error("Image reference not available");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw error; // Re-throw the error to be caught in the outer catch block
      }

      const url = await imageRef.getDownloadURL();

      const collection_user = await collectionBundle();

      await collection_user.update({
        profile_pic: url,
      });

      return { status: true, error: "", url: url };
    } catch (error) {
      console.error("Error:", error);
      return { status: false, error: error.message, url: "" };
    }
  } else {
    try {
      const fileName = auth().currentUser.uid + ".jpg" || "test.jpg";
      const reference = storage()?.ref();
      const imageRef = reference.child(fileName);
      await imageRef.put(path);
      const url = await imageRef.getDownloadURL();

      // const url = await storage().ref(fileName).getDownloadURL();

      const collection_user = await collection();
      await collection_user.update({
        profile_pic: url,
      });

      return { status: true, error: "", url: url };
    } catch (error) {
      return { status: false, error: error.message, url: "" };
    }
  }
}

async function UPDATE_USER_SUBSCRIPTION(data) {
  if (IS_BUNDLE_APP) {
    try {
      const collection_user = await collectionBundle();
      await collection_user.update(data);
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  } else {
    try {
      const collection_user = await collection();
      await collection_user.update(data);
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  }
}

 async function GET_STRIPE_DETAILS(uid) {
  try {
    const customerCollection = firestore()
      .collection("customers")
      .doc(uid)
      .collection("subscriptions");
    // const subscriptionDetails = await customerCollection();
    const result = await customerCollection.get();
    let list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.doc_id = documentSnapshot.id;
      list.push(data);
    });
    // Filter data based on product ID condition and active status
    const filterData = list?.filter(
      (ele) => ele?.product?.id === THIRD_PARTY_CONFIG.STRIPE_PRODUCT_ID && ele.status === 'active'
  );
  
    // If filtered data is available, get the price details
    for (const item of filterData) {
      if (item.price) {
        const priceDoc = await item.price.get(); // Fetch the price document only for filtered data
        if (priceDoc.exists) {
          item.priceDetails = priceDoc.data(); // Attach price details
        }
      }
    }

    // Return the filtered data if available
    if (filterData.length > 0) {
      return { status: true, data: filterData, error: "" };
    } else {
      return { status: false, error: "No active subscription available yet" };
    }
  } catch (err) {
    return { status: false, error: err?.message };
  }
} 

async function GET_USER_STRIPE_ONE_TIME_PAYMENT(uid) {
  try {
    const customerCollection = firestore()
      .collection("customers")
      .doc(uid)
      .collection("payments")
      .where("status", "==", "succeeded");
    const result = await customerCollection.get();
    let paymentsList = [];

    for (const doc of result.docs) {
      const data = doc.data();

      // Log the type of 'prices' to ensure it's an array containing a DocumentReference
      //console.log("Prices is an array:", Array.isArray(data.prices));
      if (Array.isArray(data.prices) && data.prices.length > 0) {
        //console.log("First element of prices array:", data.prices[0]);

        // Check if the first element is a DocumentReference
        if (data.prices[0] instanceof firestore.DocumentReference) {
          try {
            // Fetch the referenced document
            const priceDoc = await data.prices[0].get();
            if (priceDoc.exists) {
              // Add the fetched price data to the payment object
              data.priceData = priceDoc.data();
            }
          } catch (err) {
            console.error("Error fetching price document:", err);
          }
        }
        paymentsList.push(data);
      }
    }

    paymentsList.sort((a, b) => b.created - a.created);
    //console.log("Payments list:", paymentsList);
    // Filter the payments list based on the product ID within the fetched price data
    const filteredPayments = paymentsList.filter(
      (payment) =>
        payment?.priceData?.product === THIRD_PARTY_CONFIG?.STRIPE_PRODUCT_ID
    );
    //console.log("Filtered payments:", filteredPayments);
    if (filteredPayments.length > 0) {
      return { status: true, data: filteredPayments, error: "" };
    } else {
      return {
        status: false,
        error: "No payments found matching the product ID.",
      };
    }
  } catch (err) {
    console.error("Error fetching user stripe one-time payment:", err);
    return {
      status: false,
      error: err.message || "An error occurred while fetching payments.",
    };
  }
}

async function GET_REVENUECAT_METADATA(appName) {
  try {
      // Get all documents from the 'products' collection
      const result = await firestore()
          .collection('metadata')
          .doc('revenuecat')
          .collection('products')
          .get();

      let filteredData = [];

      // Loop through the documents and filter based on 'app' field
      result.forEach((documentSnapshot) => {
          const data = documentSnapshot.data();
          if (data.app === appName) {
              filteredData.push({ id: documentSnapshot.id, ...data });
          }
      });

      // Return the filtered data
      if (filteredData.length > 0) {
          return { status: true, data: filteredData, error: '' };
      } else {
          return { status: false, error: 'No matching documents found' };
      }
  } catch (error) {
      return { status: false, error: error.message };
  }
}

async function GET_REVENUECAT_EVENTS() {
try {
  const result = await firestore().collection('revenuecat').doc(auth().currentUser.uid).collection('events').get()
  var list = []
  result.forEach(documentSnapshot => {
      var data = documentSnapshot.data()
      data.doc_id = documentSnapshot.id
      list.push(data)
  });

  if (list.length > 0) {
      return { status: true, data: list, error: '' }
  }
  else {
      return { status: true, data: [], error: '' }
  }
}
catch (error) {
  return { status: false, error: error.message }
}

}

 async function GET_REVENUECAT_SUBSCRIPTION_PLAN(productIdentifier) {
  try {
          const result = await firestore().collection('metadata').doc('revenuecat').collection('products').doc(productIdentifier).get()
          return { status: true, data: result.data().plan, error: '' }
        
  }
  catch (error) {
      return { status: false, error: error.message }
  }
} 

  

async function GET_CURRENCY_PRICE(priceId, currencyCode) {
  try {
    const stripe = await getStripe();
    //console.log(stripe, "stripe data");
    const response = await stripe.prices.retrieve(priceId, {
      expand: ["tiers"],
    });
    //console.log(response, "response data");

    const currencyOptions = response?.data?.currency_options;

    if (currencyOptions) {
      const unitAmount = currencyOptions[currencyCode]?.unit_amount;

      return {
        status: true,
        data: {
          currency_options: currencyOptions,
          currency: currencyCode,
          unit_amount: unitAmount,
        },
        error: null,
      };
    } else {
      return {
        status: false,
        data: null,
        error: "No currency options available",
      };
    }
  } catch (err) {
    console.error("Error fetching currency price:", err);
    return { status: false, data: null, error: err?.message };
  }
}

async function GET_COUNTRY_CODE() {
  try {
    const countryData = await axios.get("https://api.country.is");
    //console.log(countryData.data, "get country data api");
    return countryData?.data?.country;
    /* 
    const countryDetails = await axios.get(
      `https://restcountries.com/v3.1/alpha/${countryData?.data?.country}`
    );
    const formattedCurrencies = Object.entries(
      countryDetails?.data[0]?.currencies
    ).map(([currencyCode, currencyData]) => ({
      currencyCode: currencyCode,
      name: currencyData?.name,
      symbol: currencyData?.symbol,
      country: countryData?.data?.country,
      ip: countryData?.data?.ip,
    }));

    // console.log(
    //   countryDetails?.data[0]?.currencies,
    //   "all country details ------------"
    // );
    return { status: true, data: formattedCurrencies[0], error: "error" }; */
  } catch (err) {
    return "US";
  }
}

async function UPDATE_USER_TEST_OPTIONS(time_per_question, allow_go_back) {
  try {
    const collection_user = await collection();
    await collection_user.update({
      time_per_question: time_per_question,
      allow_go_back: allow_go_back,
    });
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function UPDATE_USER_THEME(theme) {
  if (IS_BUNDLE_APP) {
    try {
      const collection_user = await collectionBundle();
      await collection_user.update({
        app_theme: theme,
      });
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  } else {
    try {
      const collection_user = await collection();
      await collection_user.update({
        app_theme: theme,
      });
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  }
}

async function UPDATE_USER_FONTS_OPTIONS(font_size) {
  if (IS_BUNDLE_APP) {
    try {
      const collection_user = await collectionBundle();
      await collection_user.update({
        font_size: font_size,
      });
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  } else {
    try {
      const collection_user = await collection();
      await collection_user.update({
        font_size: font_size,
      });
      return { status: true, error: "" };
    } catch (error) {
      return { status: false, error: error.message };
    }
  }
}

async function DELETE_USER(uid) {
  try {
    const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
    const userCollection = firestore()
      .collection("apps")
      .doc(APP_NAME)
      .collection("users")
      .doc(uid);
    const result = await userCollection.delete();
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function DELETE_BUNDLE_USER(uid) {
  try {
    const userCollection = firestore()
      .collection("apps")
      .doc(BUNDLE_APP_NAME)
      .collection("users")
      .doc(uid);
    const result = await userCollection.delete();
    return { status: true, error: "" };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_FAQS() {
  try {
    const collection_faq = await faqCollection();
    const result = await collection_faq.orderBy("id", "asc").get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.doc_id = documentSnapshot.id;
      list.push(data);
    });

    if (list.length > 0) {
      return { status: true, data: list, error: "" };
    } else {
      return { status: false, error: "No Faqs available yet" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_ALL_USERS() {
  try {
    const collection_faq = await allUserCollection();
    const result = await collection_faq.get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.doc_id = documentSnapshot.id;
      list.push(data);
    });

    if (list.length > 0) {
      return { status: true, data: list, error: "" };
    } else {
      return { status: false, error: "No users available yet" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_COMMON_FAQS() {
  try {
    const collection_faq = await commonFaqs();
    const result = await collection_faq.orderBy("id", "asc").get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.doc_id = documentSnapshot.id;
      list.push(data);
    });

    if (list.length > 0) {
      return { status: true, data: list, error: "" };
    } else {
      return { status: false, error: "No Faqs available yet" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_OTHER_APPS() {
  try {
    const result = await otherAppCollection().get();
    var list = [];
    result.forEach((documentSnapshot) => {
      var data = documentSnapshot.data();
      data.doc_id = documentSnapshot.id;
      list.push(data);
    });

    if (list.length > 0) {
      return { status: true, data: list, error: "" };
    } else {
      return { status: false, error: "No other apps available yet" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function STORE_AUTH_DETAILS(APP_NAME) {
  const result = await firestore()
    .collection("apps")
    .doc("AUTH")
    .collection("users")
    .doc(auth().currentUser.uid)
    .get();
  if (result.exists) {
    firestore()
      .collection("apps")
      .doc("AUTH")
      .collection("users")
      .doc(auth().currentUser.uid)
      .update({
        apps: firestore.FieldValue.arrayUnion(APP_NAME),
        email: auth().currentUser.email,
      });
  } else {
    firestore()
      .collection("apps")
      .doc("AUTH")
      .collection("users")
      .doc(auth().currentUser.uid)
      .set({
        apps: firestore.FieldValue.arrayUnion(APP_NAME),
        email: auth().currentUser.email,
      });
  }
}

async function GET_STORE_AUTH_DETAILS() {
  try {
    const result = await firestore()
      .collection("apps")
      .doc("AUTH")
      .collection("users")
      .doc(auth().currentUser.uid)
      .get();
    if (result.exists) {
      return {
        status: true,
        data: result.data(),
        error: "",
        isUserExist: true,
      };
    } else {
      return { status: true, data: null, error: "", isUserExist: false };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function SET_CERTIFICATE_NAME(certificate) {
  try {
    const collection_user = await collectionBundle();
    const result = await collection_user.get();
    if (result.exists) {
      const collection_user = await collectionBundle();
      await collection_user.update({
        auth_email: auth().currentUser.email,
        auth_login_provider:
          auth().currentUser?.providerData[0]?.providerId ?? "",
        last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
        signup_date: auth().currentUser.metadata?.creationTime ?? "",
        current_certificate: certificate,
      });
      return { status: true, error: "" };
    } else {
      const collection_user = await collectionBundle();
      await collection_user.set({
        auth_email: auth().currentUser.email,
        auth_login_provider:
          auth().currentUser?.providerData[0]?.providerId ?? "",
        last_signin_time: auth().currentUser.metadata?.lastSignInTime ?? "",
        signup_date: auth().currentUser.metadata?.creationTime ?? "",
        current_certificate: certificate,
      });
      return { status: true, error: "" };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

// Function to get active promotion codes from Firestore
const getActivePromotionCodes = async () => {
  try {
    const promotionCodesSnapshot = await firestore().collection('promotionCodes').get();
    const promotionCodes = {};
    promotionCodesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.active) {
        promotionCodes[data.code.toUpperCase()] = {
          percent_off: data.coupon.percent_off,
          id: data.id,
        };
      }
    });
    return promotionCodes;
  } catch (error) {
    console.error("Error fetching promotion codes: ", error);
    throw error;
  }
};

async function UPDATE_USER_NEW_CISSP_TAG() {
  try {
      const collection_user = await collection()
      await collection_user.update({
          isQuestionLatestVersionUpdated: true,
      })
      return { status: true, error: '' }
  }
  catch (error) {
      return { status: false, error: error.message }
  }
}


async function UPDATE_CANCEL_SUBSCRIPTION_REASON(data) {
  try {
    // Format current date as YYYY-MM-DD using native Date
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Gets YYYY-MM-DD format

    if (IS_BUNDLE_APP) {
      firestore().collection('apps').doc(BUNDLE_APP_NAME).collection('users')
        .doc(auth().currentUser.uid)
        .collection('SubscriptionCancelReason').doc(dateString).set(data);
    } else {
      const APP_NAME = await GET_APP_NAME_FOR_COLLECTION();
      firestore().collection('apps').doc(APP_NAME).collection('users')
        .doc(auth().currentUser.uid)
        .collection('SubscriptionCancelReason').doc(dateString).set(data);
    }
  } catch (error) {
    console.log(error);
  }
}


export {
  UPDATE_USER_PROFILE,
  UPDATE_BUNDLE_USER_PROFILE,
  GET_USER_PROFILE,
  GET_BUNDLE_PROFILE,
  UPDATE_NOTIFICATION_SETTING,
  UPLOAD_PROFILE,
  UPDATE_PROFILE_DETAILS,
  UPDATE_BUNDLE_PROFILE_DETAILS,
  UPDATE_USER_SUBSCRIPTION,
  GET_USER_STRIPE_ONE_TIME_PAYMENT,
  GET_STRIPE_DETAILS,
  GET_CURRENCY_PRICE,
  GET_COUNTRY_CODE,
  UPDATE_USER_TEST_OPTIONS,
  DELETE_USER,
  DELETE_BUNDLE_USER,
  GET_FAQS,
  GET_OTHER_APPS,
  STORE_AUTH_DETAILS,
  GET_STORE_AUTH_DETAILS,
  UPDATE_USER_AUTH_DETAILS,
  SET_CERTIFICATE_NAME,
  GET_COMMON_FAQS,
  GET_ALL_USERS,
  UPDATE_USER_FONTS_OPTIONS,
  UPDATE_USER_THEME,
  getActivePromotionCodes,
  UPDATE_USER_NEW_CISSP_TAG,
  UPDATE_CANCEL_SUBSCRIPTION_REASON,
    GET_REVENUECAT_EVENTS,
    GET_REVENUECAT_METADATA,
    GET_REVENUECAT_SUBSCRIPTION_PLAN
};
