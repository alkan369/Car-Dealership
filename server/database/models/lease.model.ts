import { model } from "mongoose";
import { LeaseSchema } from "../schemas/lease.schema";

export const LeaseModel = model('Lease', LeaseSchema);