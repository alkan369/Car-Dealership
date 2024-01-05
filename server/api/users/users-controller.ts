import { Router } from "express";
import { deleteUser, getAllUsers, getUserByEmail, getUserByFirstAndLastName, getUserByFirstName, getUserByLastName, getUserByUsername, loginUser } from "../../database/methods/user.methods";
import { validateToken } from "../../middleware/token-validator";

const usersController = Router();

usersController.get('/view_all', async (req, res) => {
    await getAllUsers(req, res);
})

usersController.get('/view_by_username/:username', async (req, res) => {
    await getUserByUsername(req, res);
})

usersController.get('/view_by_email/:email', async (req, res) => {
    await getUserByEmail(req, res);
})

usersController.get('/view_by_first_name/:firstName', async (req, res) => {
    await getUserByFirstName(req, res);
})

usersController.get('/view_by_last_name/:lastName', async (req, res) => {
    await getUserByLastName(req, res);
})

usersController.get('/view_by_first_and_last_name/:firstName/:lastName', async (req, res) => {
    await getUserByFirstAndLastName(req, res);
})

usersController.post('/login', async (req, res) => {
    const username = req.body.username;
    if (!username || username === '') {
        return res.status(400).json({ message: 'Username Not Entered' });
    }

    const password = req.body.password;
    if (!password || password === '') {
        return res.status(400).json({ message: 'Password Not Entered' })
    }

    await loginUser(req, res);
})

usersController.delete('/delete/:username', validateToken, async (req, res) => {
    // CANNOT DELETE PROFILE IF THERE IS LEASE WHICH IS NOT PAYED
    await deleteUser(req, res);
})

export default usersController;

/** NOTES :
 * ADD LEASE OPTION DB(PRIMARY KEY : VIN, PERSON USERNAME, PERCENT FIRST PAY(10-50%), HOW MANY MONTHS(HOW MANY VNOSKI),PAY PER VNOSKA,REMAINING PAY)
 * WHEN BUYING A CAR : CHANGE THE CAR'S STATUS TO SOLD
 * IN USERS DB ADD ARRAY FIELD FOR RESERVED CARS, IF THEN DECIDED TO BUY THE CAR -> TO SOLD
 * ELSE UNRESERVE THE CAR
 * Purvonachalna vnoska, ostavashta cena / broy vnoski = cena na vnoska bez oskupqvane
*/