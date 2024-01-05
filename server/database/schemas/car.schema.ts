import { Schema } from 'mongoose';

export const engineType = ['Diesel', 'Petrol', 'LPG', 'Petrol/LPG', 'Hybrid', 'Electric'];
export const transmissionType = ['Manual', 'Automatic'];

export const CarSchema = new Schema({
    id: Schema.Types.ObjectId,
    VIN: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    brand: {
        type: Schema.Types.String,
        required: true
    },
    model: {
        type: Schema.Types.String,
        required: true
    },
    year: {
        type: Schema.Types.Number,
        required: true
    },
    engine: {
        type: Schema.Types.String,
        required: true,
        enum: ['Diesel', 'Petrol', 'LPG', 'Petrol/LPG', 'Hybrid', 'Electric']
    },
    transmission: {
        type: Schema.Types.String,
        required: true,
        enum: ['Manual', 'Automatic']
    },
    kilometers: {
        type: Schema.Types.Number,
        required: true
    },
    price: {
        type: Schema.Types.Number,
        required: true
    },
    state: {
        type: Schema.Types.String,
        default: 'For Sale',
        enum:['For Sale', 'Reserved', 'Sold']
    }
})