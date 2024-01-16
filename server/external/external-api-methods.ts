import Stripe from 'stripe'
import { STRIPE_KEY, ZEROBOUNCE_KEY } from '..';

export const validateDebitCard = async (cardNumber: string, expMonth: number, expYear: number, cvc: string) => {
    const stripe = new Stripe(STRIPE_KEY, {
        apiVersion: '2023-10-16', // Use the latest API version
    });

    // const paymentMethod = await stripe.paymentMethods.create({
    //     type: 'card',
    //     card: {
    //         number: cardNumber,
    //         exp_month: expMonth,
    //         exp_year: expYear,
    //         cvc: cvc,
    //     },
    // });

    // card: {
    //     number: '4242424242424242',
    //     exp_month: 8,
    //     exp_year: 2026,
    //     cvc: '314',
    //   },
};

export const simulatePayment = async (desiredAmount: number, desiredCurrency: string) => {
    const stripe = new Stripe(STRIPE_KEY, {
        apiVersion: '2023-10-16', // Use the latest API version
    });

    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: Number(desiredAmount.toFixed(2)) * 100,
            currency: desiredCurrency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            },
            confirm: true,
            payment_method: 'pm_card_visa'
        }
    );
};

export const validateEmail = async (email: string) => {
    const apiURL = 'https://api.zerobounce.net/v2/validate';
    const queryString = `?api_key=${ZEROBOUNCE_KEY}&email=${email}&ip_address=`;
    const fullURL = apiURL + queryString;

    const response = await fetch(fullURL);

    if (!response.ok) {
        console.log(`Error validating email. Status: ${response.status}`)
        throw new Error(`Error validating email. Status: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 'valid') {
        console.log(`Not Valid`)
        throw JSON.stringify(result);
    }
};
