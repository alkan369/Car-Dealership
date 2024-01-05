import { Application, Router } from "express";
import carsController from "./cars/cars-controller";
import usersController from "./users/users-controller";
import leasesController from "./leases/leases-controller";

const router = Router()

export const connect = (app: Application, path: string): void => {
    router.use('cars', carsController);
    router.use('users', usersController);
    router.use('leases', leasesController)
    app.use(path, router);
}