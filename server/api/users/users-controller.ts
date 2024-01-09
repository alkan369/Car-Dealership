import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserByEmail, getUserByFirstAndLastName, getUserByFirstName, getUserByLastName, getUserByUsername, loginUser } from "../../database/methods/user.methods";
import { validateAdmin, validateToken } from "../../middleware/token-validator";
import { LeaseModel } from "../../database/models/lease.model";
import { UserModel } from "../../database/models/user.model";
import { validateDebitCard, validateEmail } from "../../external/external-api-methods";

const usersController = Router();

usersController.get('/view_all', async (req, res) => {
    await getAllUsers(req, res);
})

usersController.get('/view_by_username/:username', async (req, res) => {
    if (!req.params.username || req.params.username === '') {
        return res.status(400).json({ message: 'User Name Not Entered' });
    }

    await getUserByUsername(req, res);
})

usersController.get('/view_by_email/:email', async (req, res) => {
    if (!req.params.email || req.params.email === '') {
        return res.status(400).json({ message: 'Email Not Entered' });
    }

    try {
        // validate Email
        // await validateEmail(req.params.email);
    }
    catch (error) {
        return res.status(400).json(error);
    }

    await getUserByEmail(req, res);
})

usersController.get('/view_by_first_name/:firstName', async (req, res) => {
    if (!req.params.firstName || req.params.firstName === '') {
        return res.status(400).json({ message: 'First Name Not Entered' });
    }

    await getUserByFirstName(req, res);
})

usersController.get('/view_by_last_name/:lastName', async (req, res) => {
    if (!req.params.lastName || req.params.lastName === '') {
        return res.status(400).json({ message: 'Last Name Not Entered' });
    }

    await getUserByLastName(req, res);
})

usersController.get('/view_by_first_and_last_name/:firstName/:lastName', async (req, res) => {
    if (!req.params.firstName || req.params.firstName === '') {
        return res.status(400).json({ message: 'First Name Not Entered' });
    }

    if (!req.params.lastName || req.params.lastName === '') {
        return res.status(400).json({ message: 'Last Name Not Entered' });
    }

    await getUserByFirstAndLastName(req, res);
})

usersController.post('/create', async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const debitCardNumber = req.body.debitCardNumber;
    const cardExpMonth = req.body.cardExpMonth;
    const cardExpYear = req.body.cardExpYear;
    const cardCVC = req.body.cardCVC;

    if (!username || username === '') {
        return res.status(400).json({ message: 'User Name Not Entered' });
    }

    if (await UserModel.findOne({ username: username })) {
        return res.status(400).json({ message: 'User With Such Username Already Exists' });
    }

    if (!email || email === '') {
        return res.status(400).json({ message: 'Email Not Entered' });
    }

    try {
        // validate Email
        // await validateEmail(email);
    }
    catch (error) {
        return res.status(400).json(error);
    }

    if (await UserModel.findOne({ email: email })) {
        return res.status(400).json({ message: 'User With Such Email Already Exists' });
    }

    if (!password || password === '' || !confirmPassword || confirmPassword === '') {
        return res.status(400).json({ message: 'Password Or Confirm Password Not Entered' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Password And Confirm Password Do Not Match' });
    }

    if (!firstName || firstName === '') {
        return res.status(400).json({ message: 'First Name Not Entered' });
    }

    if (!lastName || lastName === '') {
        return res.status(400).json({ message: 'Last Name Not Entered' });
    }

    if (!debitCardNumber || debitCardNumber === '') {
        return res.status(400).json({ message: 'Debit Card Number Not Entered' });
    }

    if (!cardExpMonth || cardExpMonth === '') {
        return res.status(400).json({ message: 'Debit Card Expiration Month Not Entered' });
    }

    if (!cardExpYear || cardExpYear === '') {
        return res.status(400).json({ message: 'Debit Card Expiration Year Not Entered' });
    }

    if (!cardCVC || cardCVC === '') {
        return res.status(400).json({ message: 'Debit Card CVC Not Entered' });
    }

    try {
        // validate Debit Card
        await validateDebitCard(debitCardNumber, cardExpMonth, cardExpYear, cardCVC);
    }
    catch (error) {
        return res.status(400).json({ error });
    }

    await createUser(req, res);
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

usersController.delete('/delete/:username', validateAdmin, validateToken, async (req, res) => {
    if(!req.params.username || req.params.username === ''){
        return res.status(400).json({ message: 'Username Not Entered' })
    }
    
    const checkLease = await LeaseModel.find({ buyerUsername: req.params.username });
    if (checkLease) {
        return res.status(400).json({ message: 'User Has Remaining Payments' });
    }

    await deleteUser(req, res);
})

export default usersController;