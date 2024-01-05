import { Router } from "express";
import { addLeaseToUser, getUserLeases, payLease } from "../../database/methods/lease.methods";
import { PaymentCnt, PercentFirstPayment } from "../../database/schemas/lease.schema";


const leasesController = Router();

leasesController.get('/view_payment_amount', async (req, res) => {
    res.status(200).json(
        {
            'PercentFirstPayment': PercentFirstPayment.toString(),
            'PaymentCnt': PaymentCnt.toString()
        }
    )
})

leasesController.get('/view_all/:username', async (req, res) => {
    await getUserLeases(req, res);
})

leasesController.post('/buy_with_lease/:VIN/:username', async (req, res) => {
    if (PercentFirstPayment.indexOf(req.body.percentFirstPayment) === -1) {
        res.status(400).json({ message: 'First Payment Percent Must Be 20%, 30%, 40% or 50%' });
        return;
    }

    if(PaymentCnt.indexOf(req.body.paymentCnt) === -1) {
        res.status(400).json({ message: 'First Payment Cnt Must Be 12, 24, 48 or 60 months' });
        return;
    }

    await addLeaseToUser(req, res);
})

leasesController.put('/pay_remaining_lease/:VIN/:username', async (req, res) => {
    await payLease(req, res);
})

export default leasesController;