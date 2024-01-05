import { Schema } from 'mongoose';

export const PercentFirstPayment = [20, 30, 40, 50];
export const PaymentCnt = [12, 24, 48, 60]; // months -> 1 payment per month = 12..60 payments

export const LeaseSchema = new Schema({
    id: Schema.Types.ObjectId,
    VIN: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    buyerUsername: {
        type: Schema.Types.String,
        required: true,
    },
    percentFirstPayment: {
        type: Schema.Types.Number,
        required: true,
        default: 20
    },
    paymentCnt: {
        type: Schema.Types.Number,
        required: true,
        default: 12
    },
    leasePayment: {
        type: Schema.Types.Number,
        required: true
    },
    paymentCntRemaining: {
        type: Schema.Types.Number,
        required: true
    }
})