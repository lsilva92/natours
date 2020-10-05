/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HYCb7LDqQcUoSIZm2YZkMYhHBsW5YLQNZSLhS2IP5UqpWuM3re9oHp9lBpyZ9dStT3OJG1ccStY95KsprVzzzdk00UN7UKTQl'
);

export const bookTour = async tourId => {
  try {
    //1) Get checkout session from API
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);

    //2) Create checkout form + process + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
