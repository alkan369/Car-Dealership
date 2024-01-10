import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken";

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log("HEADER: ", authHeader);
    const adminToken = authHeader.split(' ').pop().slice(0,5);

    const token = authHeader && (adminToken === 'Admin'? authHeader.split(' ').pop().slice(5) : authHeader.split(' ').pop());

    if (!token) {
        return res.status(401).send('Invalid token format');
    }

    try {
        const user = verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    } catch (err) {
        res.status(403).json({
            message: 'Unable to verify token',
            err
        });
        return;
    }

    next();
}

export const validateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const adminToken = authHeader.slice(0,5);
    if (adminToken !== 'Admin') {
        return res.status(401).json({ message: 'Not Admin Profile' });
    }
    next();
}