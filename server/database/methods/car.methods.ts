import express from "express";
import { CarModel } from "../models/car.model";
import mongoose, { mongo } from "mongoose";
import { engineType, transmissionType } from "../schemas/car.schema";
import { UserModel } from "../models/user.model";
import { simulatePayment } from "../../external/external-api-methods";

export async function getAllCars(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const cars = await CarModel.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getAllAvailableCars(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const cars = await CarModel.find({ state: 'For Sale' });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByVIN(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const car = await CarModel.find({ VIN: req.params.VIN });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByBrand(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const cars = await CarModel.find({ brand: req.params.brand });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByBrandAndModel(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const cars = await CarModel.find({ brand: req.params.brand, model: req.params.model });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByEngine(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const engineTypeIndex: number = engineType.indexOf(req.params.engine);
        if (engineTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid engine type' });
            return;
        }

        const cars = await CarModel.find({ engine: req.params.engine });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByBrandAndModelAndEngine(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const engineTypeIndex: number = engineType.indexOf(req.params.engine);
        if (engineTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid engine type' });
            return;
        }

        const cars = await CarModel.find({ brand: req.params.brand, model: req.params.model, engine: req.params.engine });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByTransmission(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const transmissionTypeIndex: number = transmissionType.indexOf(req.params.transmission);
        if (transmissionTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid transmission type' });
            return;
        }

        const cars = await CarModel.find({ transmission: req.params.transmission });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByEngineAndTransmission(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const engineTypeIndex: number = engineType.indexOf(req.params.engine);
        if (engineTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid engine type' });
            return;
        }

        const transmissionTypeIndex: number = transmissionType.indexOf(req.params.transmission);
        if (transmissionTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid transmission type' });
            return;
        }

        const cars = await CarModel.find({ engine: req.params.engine, transmission: req.params.transmission });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getByBrandAndModelAndEngineAndTransmission(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const engineTypeIndex: number = engineType.indexOf(req.params.engine);
        if (engineTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid engine type' });
            return;
        }

        const transmissionTypeIndex: number = transmissionType.indexOf(req.params.transmission);
        if (transmissionTypeIndex === -1) {
            res.status(400).json({ message: 'Invalid transmission type' });
            return;
        }

        const cars = await CarModel.find({ brand: req.params.brand, model: req.params.model, engine: req.params.engine, transmission: req.params.transmission });
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function addCar(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const newCar = new CarModel({
            id: new mongoose.Types.ObjectId(),
            VIN: req.body.VIN,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            engine: req.body.engine,
            transmission: req.body.transmission,
            kilometers: req.body.kilometers,
            price: req.body.price,
            state: 'For Sale'
        })

        const validationError = newCar.validateSync();
        if (validationError) {
            res.status(400).json(validationError);
            return;
        }
        await newCar.save();
        res.status(201).json(newCar);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export async function removeCar(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const deletedCar = await CarModel.findOneAndDelete({ VIN: req.params.VIN });
        if (!deletedCar) {
            res.status(400).json({ message: 'No Car With Such VIN' });
            return;
        }
        res.status(200).json(deletedCar);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

export async function reserveCar(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const reservingUser = await UserModel.findOne({ username: req.params.username });
        if (!reservingUser) {
            res.status(400).json({ message: 'No User With Such Username' });
            return;
        }

        const carToBeReserved = await CarModel.findOne({ VIN: req.params.VIN });
        if (!carToBeReserved) {
            res.status(400).json({ message: 'No Car With Such VIN' });
            return;
        }

        if (carToBeReserved.state !== 'For Sale') {
            res.status(400).json({ message: 'The Car Is Not For Sale' });
            return;
        }

        const reservedCar = await CarModel.findOneAndUpdate({ VIN: req.params.VIN },
            {
                $set:
                {
                    state: 'Reserved'
                }
            }
        );

        if (!reservedCar) {
            res.status(500).json({ message: 'Internal ServerError Error Updating Car Model' });
            return;
        }

        const reservingForUser = await UserModel.findOneAndUpdate({ username: req.params.username },
            {
                $push:
                {
                    reservedCarVINs: req.params.VIN
                }
            }
        );

        if (!reservingForUser) {
            res.status(500).json({ message: 'Internal ServerError Error Updating User Model' });
            return;
        }

        res.status(200).json({ reservedCar });

    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function unReserveCar(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const reservingUser = await UserModel.findOne({ username: req.params.username });
        if (!reservingUser) {
            res.status(400).json({ message: 'No User With Such Username' });
            return;
        }

        const carToBeUnReserved = await CarModel.findOne({ VIN: req.params.VIN });
        if (!carToBeUnReserved) {
            res.status(400).json({ message: 'No Car With Such VIN' });
            return;
        }

        if (carToBeUnReserved.state !== 'Reserved') {
            res.status(400).json({ message: 'The Car Is Not Reserved' });
            return;
        }

        if (reservingUser.reservedCarVINs.indexOf(req.params.VIN) === -1) {
            res.status(400).json({ message: `The Car Is Not Reserved By ${req.params.username}` });
            return;
        }

        const unReservedCar = await CarModel.findOneAndUpdate({ VIN: req.params.VIN },
            {
                $set:
                {
                    state: 'For Sale'
                }
            }
        );

        if (!unReservedCar) {
            res.status(500).json({ message: 'Internal ServerError Error Updating Car Model' });
            return;
        }

        const unReservingForUser = await UserModel.findOneAndUpdate({ username: req.params.username },
            {
                $pull:
                {
                    reservedCarVINs: req.params.VIN
                }
            }
        );

        if (!unReservingForUser) {
            res.status(500).json({ message: 'Internal ServerError Error Updating User Model' });
            return;
        }

        res.status(200).json({ unReservedCar });

    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function buyCar(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const buyingPerson = await UserModel.findOne({ username: req.params.username });
        if (!buyingPerson) {
            res.status(400).json({ message: 'No User With Such Username' });
            return;
        }

        const carToBeBought = await CarModel.findOne({ VIN: req.params.VIN });
        if (!carToBeBought) {
            res.status(400).json({ message: 'No Car With Such VIN' });
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
            // simulate payment before modifying car and user db
            simulatePayment(carToBeBought.price, 'bgn');
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


        res.status(200).json({ boughtCar });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}