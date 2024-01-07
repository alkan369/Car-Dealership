import Stripe from 'stripe'
import axios from 'axios';

// TODO ARM : ADD API KEY TO .ENV
const stripe = new Stripe('your_secret_key', {
    apiVersion: '2023-10-16', // Use the latest API version
});

export const validateDebitCard = async (cardNumber: string, expMonth: number, expYear: number, cvc: string) => {
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: cardNumber,
            exp_month: expMonth,
            exp_year: expYear,
            cvc: cvc,
        },
    });
};

const ZEROBOUNCE_API_KEY = 'YOUR_ZEROBOUNCE_API_KEY'; // TODO ARM : ADD API KEY TO .ENV

export const validateEmail = async (email: string) => {
    const response = await axios.post(
        'https://api.zerobounce.net/v2/validate',
        {
            email,
            api_key: ZEROBOUNCE_API_KEY,
        }
    );

    const { status, body } = response.data;

    if (status !== 'valid') {
        throw JSON.stringify(body);
    }
};
