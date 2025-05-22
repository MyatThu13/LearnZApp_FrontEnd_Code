// PACKAGES
import { firestore } from "./config";
import { prices } from "../../app_constant/prices"; // Ensure this is imported correctly

async function GET_ACCESS_CODE_DETAILS(code) {
  try {
    const result = await firestore()
      .collection("stripe")
      .doc("access")
      .collection("codes")
      .doc(code)
      .get();
    if (result.exists) {
      return { status: true, data: result?.data(), error: null };
    } else {
      return {
        status: false,
        data: null,
        error:
          "This access code does not exists. Please contact support to resolve this issue",
      };
    }
  } catch (error) {
    return { status: false, data: null, error: error.message };
  }
}

async function UPDATE_ACCESS_CODE_REDEEM(code, email) {
  try {
    await firestore()
      .collection("stripe")
      .doc("access")
      .collection("codes")
      .doc(code)
      .update({
        is_redeemed: true,
        redeemed_by: email,
      });
    return { status: true, data: null, error: null };
  } catch (error) {
    return { status: false, error: error.message };
  }
}

async function GET_PRODUCT_PRICES(productId, currencyData) {
  //console.log("GET_PRODUCT_PRICES", productId, currencyData);
  try {
    const result = await firestore()
      .collection("products")
      .doc(productId)
      .collection("prices")
      .orderBy("unit_amount")
      .get();
    
    const newData = result.docs
      .map((doc) => ({ ...doc.data(), priceId: doc.id })) // Map data with priceId
      .filter((price) => price.active === true) // Filter active prices
      .map((price) => {
        const type = price.type;
        let price_id = " ";
        //console.log("price", price);

        if (type === "recurring") {
          //console.log("price", price);
          price_id =
            price.interval === "month" &&
            [1, 3, 6].includes(price.interval_count)
              ? `recurring_${price.interval_count}`
              : price.interval === "year" && price.interval_count === 1
              ? "recurring_12"
              : " ";
        } else if (type === "one_time") {
          const validDescriptions = ["1", "3", "6", "12"];
          if (validDescriptions.includes(price.description)) {
            price_id = `one_time_${price.description}`;
          }
        }

        const productPrices = prices[price_id];
        //console.log("productPrices", productPrices);
        const priceDetails = (productPrices && productPrices[currencyData.currencyCode]) || productPrices["USD"];
//console.log("priceDetails", priceDetails);
        const unit_amount = parseFloat(
          priceDetails ? priceDetails.unit_amount : price.unit_amount
        );
        //console.log("unit_amount", unit_amount);
        let planPeriod = "";
        let planDiscount = "";
        let monthlyPrice = "";
        let basePrice = 0;
        if (type === "recurring") {
           basePrice = parseFloat(
            prices.recurring_1[currencyData.currencyCode]?.unit_amount ??
            prices.recurring_1["USD"].unit_amount
          );
          //console.log("basePrice", basePrice);
          planPeriod =
            price.interval === "month"
              ? price.interval_count === 1
                ? "Monthly"
                : price.interval_count === 3
                ? "Quarterly"
                : price.interval_count === 6
                ? "Semi-Annual"
                : " "
              : price.interval === "year" && price.interval_count === 1
              ? "Annual"
              : " ";

          planDiscount =
            price.interval === "month"
              ? price.interval_count === 1
                ? ""
                : price.interval_count === 3
                ? `${100 - ((unit_amount / (basePrice * 3)) * 100).toFixed(0)}%`
                : price.interval_count === 6
                ? `${100 - ((unit_amount / (basePrice * 6)) * 100).toFixed(0)}%`
                : ""
              : price.interval === "year" && price.interval_count === 1
              ? `${100 - ((unit_amount / (basePrice * 12)) * 100).toFixed(0)}%`
              : "";

          monthlyPrice =
            price.interval === "month"
              ? price.interval_count === 1
                ? ""
                : price.interval_count === 3
                ? `${(unit_amount / (3 * 100)).toFixed(2)}`
                : price.interval_count === 6
                ? `${(unit_amount / (6 * 100)).toFixed(2)}`
                : ""
              : price.interval === "year" && price.interval_count === 1
              ? `${(unit_amount / (12 * 100)).toFixed(2)}`
              : "";
        }
        if (type === "one_time") {
           basePrice = parseFloat(
            prices.one_time_1[currencyData.currencyCode]?.unit_amount ??
            prices.one_time_1["USD"].unit_amount
          );
          planPeriod =
            price.description === "1"
              ? "1 Month"
              : price.description === "3"
              ? "3 Months"
              : price.description === "6"
              ? "6 Months"
              : price.description === "12"
              ? "12 Months"
              : " ";

          planDiscount =
            price.description === "1"
              ? ""
              : price.description === "3"
              ? `${100 - ((unit_amount / (basePrice * 3)) * 100).toFixed(0)}%`
              : price.description === "6"
              ? `${100 - ((unit_amount / (basePrice * 6)) * 100).toFixed(0)}%`
              : price.description === "12"
              ? `${100 - ((unit_amount / (basePrice * 12)) * 100).toFixed(0)}%`
              : " ";
          //console.log("planDiscount", planDiscount);
          monthlyPrice =
            price.description === "1"
              ? ""
              : price.description === "3"
              ? `${(unit_amount / (3 * 100)).toFixed(2)}`
              : price.description === "6"
              ? `${(unit_amount / (6 * 100)).toFixed(2)}`
              : price.description === "12"
              ? `${(unit_amount / (12 * 100)).toFixed(2)}`
              : "";
        }

        return {
          ...price,
          basePrice: basePrice,
          unit_amount: priceDetails
            ? priceDetails.unit_amount
            : price.unit_amount,
          currencyCode: priceDetails ? currencyData.currencyCode : "USD",
          currencySymbolHtml: priceDetails
            ? currencyData.currencySymbolHtml
            : "&#36;",
          planPeriod: planPeriod,
          planDiscount: planDiscount,
          monthlyPrice: monthlyPrice,
        };
      });

    //console.log("newData", newData);

    if (newData) {
      return { status: true, data: newData, error: null };
    } else {
      return {
        status: false,
        data: null,
        error: "Price data does not exist",
      };
    }
  } catch (error) {
    return { status: false, error: error.message };
  }
}

export {
  GET_ACCESS_CODE_DETAILS,
  UPDATE_ACCESS_CODE_REDEEM,
  GET_PRODUCT_PRICES,
};
