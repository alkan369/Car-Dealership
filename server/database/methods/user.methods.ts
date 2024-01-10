import express from "express";
import { UserModel } from "../models/user.model";
import { genSaltSync, hashSync, compare } from "bcrypt";
import mongoose from "mongoose";
import { tokenGenerator } from "../../utils/token-generator";

export async function getAllUsers(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserByUsername(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const user = await UserModel.find({ username: req.params.username });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserByEmail(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const user = await UserModel.find({ email: req.params.email });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserByFirstName(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const users = await UserModel.find({ firstName: req.params.firstName });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserByLastName(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const users = await UserModel.find({ lastName: req.params.lastName });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function getUserByFirstAndLastName(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const users = await UserModel.find({ firstName: req.params.firstName, lastName: req.params.lastName });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function createUser(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const newUser = new UserModel({
            id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            email: req.body.email,
            password: hashSync(req.body.password, genSaltSync()),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            debitCardNumber: hashSync(req.body.debitCardNumber, genSaltSync()),
            cardExpMonth: hashSync(req.body.cardExpMonth, genSaltSync()),
            cardExpYear: hashSync(req.body.cardExpYear, genSaltSync()),
            cardCVC: hashSync(req.body.cardCVC, genSaltSync()),
            isAdmin: req.body.isAdmin ? true : false
        })

        console.log("Alkan Line 99");
        const validationError = newUser.validateSync();
        console.log("Alkan Line 101");
        if (validationError) {
            res.status(400).json(validationError);
            return;
        }
        
        console.log("Alkan Line 107");
        await newUser.save();
        console.log("Alkan Line 108");
        const token = tokenGenerator(req.body.username);
        if (newUser.isAdmin) {
            res.status(201).json({ 'token': 'Admin' + token });
        }
        else {
            res.status(201).json({ 'token': token });
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export async function loginUser(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {
        const searchedUser = await UserModel.findOne({ username: req.body.username })
        if (!searchedUser || !await compare(req.body.password, searchedUser.password.toString())) {
            res.status(401).json({ message: 'Invalid Username Or Password' });
            return;
        }

        console.log("Alkan Line 133");
        const token = tokenGenerator(searchedUser.username.toString());
        console.log("Alkan Line 135");
        
        if (searchedUser.isAdmin) {
            res.status(200).json({ 'token': 'Admin' + token });
            console.log("Alkan Line 139");
        }
        else {
            res.status(200).json({ 'token': token });
            console.log("Alkan Line 143");
        }
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function deleteUser(
    req: express.Request,
    res: express.Response
): Promise<void> {
    try {

        const deletedUser = await UserModel.findOneAndDelete({ username: req.params.username });
        if (!deletedUser) {
            res.status(400).json({ 'message': 'No User With Such Username' });
            return;
        }

        res.status(200).json(deletedUser);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}