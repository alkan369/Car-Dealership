import express from "express"
import { LeaseModel } from "../models/lease.model"
import mongoose from "mongoose";
import { CarModel } from "../models/car.model";
import { UserModel } from "../models/user.model";
import { simulatePayment } from "../../external/external-api-methods";

export async function getAllLeases(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const userLeases = await LeaseModel.find();
        res.status(200).json(userLeases);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserLeases(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const userLeases = await LeaseModel.find({ buyerUsername: req.params.username });
        res.status(200).json(userLeases);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function addLeaseToUser(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const carToBeBought = await CarModel.findOne({ VIN: req.params.VIN });
        if (!carToBeBought) {
            res.status(400).json({ message: 'No Car With Such VIN' });
            return;
        }

        const buyingPerson = await UserModel.findOne({ username: req.params.username });
        if (!buyingPerson) {
            res.status(400).json({ message: 'No User With Such Username' });
            return;
        }

        if (carToBeBought.state === 'Reserved' && buyingPerson.reservedCarVINs.indexOf(carToBeBought.VIN) === -1) {
            res.status(400).json({ message: 'The Car Is Reserved For Another Person' });
            return;
        }

        if (carToBeBought.state === 'Sold') {
            res.status(400).json({ message: 'The Car Is Already Sold' });
            return;
        }

        try {
            const firstPayment = carToBeBought.price * (req.body.percentFirstPayment / 100);
            // simulate payment before modifying car, user and lease db
            simulatePayment(firstPayment, 'bgn');
        }
        catch (error) {
            res.status(400).json(error);
        }

        const boughtCar = await CarModel.findOneAndUpdate({ VIN: req.params.VIN },
            {
                $set:
                {
                    state: 'Sold'
                }
            }
        );

        if (!boughtCar) {
            res.status(500).json({ message: 'Internal ServerError Error Updating Car Model' });
            return;
        }

        const updateUserBoughtList = await UserModel.findOneAndUpdate({ username: req.params.username },
            {
                $push:
                {
                    boughtCarVINs: req.params.VIN,
                },
                $pull:
                {
                    reservedCarVINs: req.params.VIN
                }
            }
        );

        if (!updateUserBoughtList) {
            res.status(500).json({ message: 'Internal ServerError Error Updating User Model' });
            return;
        }

        const firstPayment = carToBeBought.price * (req.body.percentFirstPayment / 100);
        const remainingPrice = carToBeBought.price - firstPayment;
        const newLease = new LeaseModel({
            id: new mongoose.Types.ObjectId(),
            VIN: req.params.VIN,
            buyerUsername: req.params.username,
            percentFirstPayment: req.body.percentFirstPayment,
            paymentCnt: req.body.paymentCnt,
            leasePayment: remainingPrice / req.body.paymentCnt,
            paymentCntRemaining: req.body.paymentCnt
        });

        const validationError = newLease.validateSync();
        if (validationError) {
            res.status(400).json(validationError);
            return;
        }
        await newLease.save();
        res.status(201).json(newLease);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function payLease(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const leaseToBeUpdated = await LeaseModel.findOne({ VIN: req.params.VIN, buyerUsername: req.params.username });
        if (!leaseToBeUpdated) {
            res.status(400).json({ message: 'Invalid Lease, Invalid VIN or Username' });
            return;
        }

        if (leaseToBeUpdated.paymentCntRemaining === 1) {
            await removeLease(req, res);
            return;
        }

        try {
            // simulate payment before modifying lease db
            simulatePayment(leaseToBeUpdated.leasePayment, 'bgn');
        }
        catch (error) {
            res.status(400).json(error);
        }

        const updateLease = await LeaseModel.findOneAndUpdate({ VIN: req.params.VIN, buyerUsername: req.params.username },
            {
                $set:
                {
                    paymentCntRemaining: leaseToBeUpdated.paymentCntRemaining - 1
                }
            }
        );

        if (!updateLease) {
            res.status(500).json({ message: 'Internal ServerError Error Updating Lease Model' });
            return;
        }

        res.status(200).json(updateLease);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function removeLease(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const deletedLease = await LeaseModel.findOneAndDelete({ VIN: req.params.VIN, buyerUsername: req.params.username });
        if (!deletedLease) {
            res.status(500).json({ message: 'No Lease With Such VIN And Such Username' });
            return;
        }

        // res.status(200).json(deletedLease);
        res.status(200).json({ message: 'Lease Payed Successfuly' });
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}