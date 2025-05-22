// stripe.js
import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    try {
      stripePromise = loadStripe(
        `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
      );
    } catch (err) {
      console.error(err);
    }
  }
  return stripePromise;
};

export default getStripe;
