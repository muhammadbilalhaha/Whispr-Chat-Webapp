import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./config/database.js";
import errorHandler from "./middlewares/errors.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";

import authentication from "./routes/authentication.route.js";
import loggedinUser from "./routes/loggedinUser.route.js";
import message from "./routes/message.route.js";
import admin from "./routes/admin.route.js";

dotenv.config({ path: "./.env" });
import "./config/cloudinary.js";
import { app, server } from "./config/socket.js";
import passport from "passport";
import "./config/passport.js";

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// express session (must be before passport + routes)
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",  // good default for localhost
        // secure: true,  // enable if using HTTPS
    },
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes (after passport)
app.use("/api/auth", authentication);
app.use("/api/auth/user", loggedinUser);
app.use("/api/auth/user/message", message);
app.use("/api/auth/admin", admin);

// DB + errors
connectMongoDB();
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`Server is running Successfully!`);
});
