import express from "express";
import { CarModel } from "../models/car.model";
import mongoose from "mongoose";
import { engineType, transmissionType } from "../schemas/car.schema";
import { UserModel } from "../models/user.model";

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
        // add car, check the engine type, transmission type in the endpoint beforehand
    }
    catch (error) {
        res.status(500).json(error);
    }
}

// remove car if For Sale, or Sold and only if leases are payed

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

        const boughtCar = await CarModel.findOneAndUpdate({ VIN: req.params.VIN },
            {
                $set:
                {
                    state: 'Sold'
                }
            }
        )

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
        )

        res.status(200).json({ boughtCar });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}