import express from "express";
import * as authController from "../controllers/authController.js";
import { rateLimit } from "express-rate-limit";


const authRouter = express.Router();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 20, // Limit each IP to 10 requests per `window` (here, per 1 hour).
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
});

// Public routes for password reset flow
authRouter.post("/forgot-password", limiter, authController.forgotPassword);
authRouter.post("/reset-password/:token", limiter, authController.resetPassword);

export default authRouter;
