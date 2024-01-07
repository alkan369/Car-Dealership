import { Schema } from 'mongoose';

export const UserSchema = new Schema({
    id: Schema.Types.ObjectId,
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    firstName: {
        type: Schema.Types.String,
        required: true
    },
    lastName: {
        type: Schema.Types.String,
        required: true
    },
    debitCardNumber: {
        type: Schema.Types.String,
        required: true
    },
    cardExpMonth: {
        type: Schema.Types.String,
        required: true
    },
    cardExpYear: {
        type: Schema.Types.String,
        required: true
    },
    cardCVC: {
        type: Schema.Types.String,
        required: true
    },
    boughtCarVINs: {
        type: [String],
        default: [],
        required: false
    },
    reservedCarVINs: {
        type: [String],
        default: [],
        required: false
    },
    isAdmin: {
        type: Schema.Types.Boolean,
        default: false
    }
})