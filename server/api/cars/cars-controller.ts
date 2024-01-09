import { Router } from "express";
import { CarModel } from "../../database/models/car.model";
import { engineType, transmissionType } from "../../database/schemas/car.schema";
import { addCar, getAllAvailableCars, getAllCars, getByBrand, getByBrandAndModel, getByBrandAndModelAndEngine, getByBrandAndModelAndEngineAndTransmission, getByEngine, getByEngineAndTransmission, getByTransmission, getByVIN, removeCar } from "../../database/methods/car.methods";
import { LeaseModel } from "../../database/models/lease.model";
import { validateAdmin, validateToken } from "../../middleware/token-validator";

const carsController = Router()

carsController.get('/view_all', async (req, res) => {
    await getAllCars(req, res);
});

carsController.get('/view_all_available', async (req, res) => {
    await getAllAvailableCars(req, res);
});

carsController.get('/view_by_vin/:vin', async (req, res) => {
    await getByVIN(req, res);
});

carsController.get('/view_by_brand/:brand', async (req, res) => {
    await getByBrand(req, res);
});

carsController.get('/view_by_brand_and_model/:brand/:model', async (req, res) => {
    await getByBrandAndModel(req, res);
});

carsController.get('/view_by_engine/:engine', async (req, res) => {
    await getByEngine(req, res);
});

carsController.get('/view_by_brand_and_model_and_engine/:brand/:model/:engine', async (req, res) => {
    await getByBrandAndModelAndEngine(req, res);
});

carsController.get('/view_by_transmission/:transmission', async (req, res) => {
    await getByTransmission(req, res);
});

carsController.get('/view_by_engine_and_transmission/:engine/:transmission', async (req, res) => {
    await getByEngineAndTransmission(req, res);
});

carsController.get('/view_by_brand_and_model_and_engine_and_transmission/:brand/:model/:engine/:transmission', async (req, res) => {
    await getByBrandAndModelAndEngineAndTransmission(req, res);
});

carsController.post('/add_car/', validateAdmin, validateToken, async (req, res) => {
    const VIN = req.body.VIN;
    const brand = req.body.brand;
    const model = req.body.model;
    const year = req.body.year;
    const engine = req.body.engine;
    const transmission = req.body.transmission;
    const kilometers = req.body.kilometers;
    const price = req.body.price;

    if (!VIN || VIN === '') {
        return res.status(400).json({ message: 'VIN Not Entered' });
    }

    if (await CarModel.findOne({ VIN: VIN })) {
        return res.status(400).json({ message: 'Car With Such VIN Already Exists' });
    }

    if (!brand || brand === '') {
        return res.status(400).json({ message: 'Brand Not Entered' });
    }

    if (!model || model === '') {
        return res.status(400).json({ message: 'Model Not Entered' });
    }

    if (!year || year === '') {
        return res.status(400).json({ message: 'Year Not Entered' });
    }

    if (!engine || engine === '') {
        return res.status(400).json({ message: 'Engine Not Entered' });
    }

    if (engineType.indexOf(engine) === -1) {
        return res.status(400).json({ message: 'Invalid Engine Type' });
    }

    if (!transmission || transmission === '') {
        return res.status(400).json({ message: 'Transmission Not Entered' });
    }

    if (transmissionType.indexOf(transmission) === -1) {
        return res.status(400).json({ message: 'Invalid Transmission Type' });
    }

    if (!kilometers || kilometers === '' || kilometers < 0) {
        return res.status(400).json({ message: 'Invalid Kilometers' });
    }

    if (!price || price === '' || price < 0) {
        return res.status(400).json({ message: 'Invalid Price' });
    }

    await addCar(req, res);
})

carsController.delete('/delete/:VIN', validateAdmin, validateToken, async (req, res) => {
    if (!req.params.VIN || req.params.VIN === '') {
        return res.status(400).json({ message: 'VIN Not Entered' });
    }

    const foundCar = await CarModel.findOne({ VIN: req.params.VIN });
    if (!foundCar) {
        return res.status(400).json({ message: 'Car With Such VIN Does Not Exist' });
    }

    if (foundCar.state === 'Reserved') {
        res.status(400).json({ message: 'Cannot Remove Reserved Car' });
    }

    const payedLeases = await LeaseModel.findOne({ VIN: req.params.VIN });
    if (payedLeases) {
        res.status(400).json({ message: 'The Car Still Has Leases To Be Payed' });
    }

    await removeCar(req, res);
})

export default carsController;
