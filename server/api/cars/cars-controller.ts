import { Router } from "express";
import { CarModel } from "../../database/models/car.model";
import { engineType } from "../../database/schemas/car.schema";
import { getAllAvailableCars, getByBrand, getByBrandAndModel, getByBrandAndModelAndEngine, getByBrandAndModelAndEngineAndTransmission, getByEngine, getByEngineAndTransmission, getByTransmission, getByVIN } from "../../database/methods/car.methods";
// validateToken

const carsController = Router()

carsController.get('/view_all'/*, validateToken*/, async (req, res) => {
    await getAllAvailableCars(req, res);
});

carsController.get('/view_by_vin/:vin'/*, validateToken*/, async (req, res) => {
    await getByVIN(req, res);
});

carsController.get('/view_by_brand/:brand'/*, validateToken*/, async (req, res) => {
    await getByBrand(req, res);
});

carsController.get('/view_by_brand_and_model/:brand/:model'/*, validateToken*/, async (req, res) => {
    await getByBrandAndModel(req, res);
});

carsController.get('/view_by_engine/:engine'/*, validateToken*/, async (req, res) => {
    await getByEngine(req, res);
});

carsController.get('/view_by_brand_and_model_and_engine/:brand/:model/:engine'/*, validateToken*/, async (req, res) => {
    await getByBrandAndModelAndEngine(req, res);
});

carsController.get('/view_by_transmission/:transmission'/*, validateToken*/, async (req, res) => {
    await getByTransmission(req, res);
});

carsController.get('/view_by_engine_and_transmission/:engine/:transmission'/*, validateToken*/, async (req, res) => {
    await getByEngineAndTransmission(req, res);
});

carsController.get('/view_by_brand_and_model_and_engine_and_transmission/:brand/:model/:engine/:transmission'/*, validateToken*/, async (req, res) => {
    await getByBrandAndModelAndEngineAndTransmission(req, res);
});

export default carsController;
