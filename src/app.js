import Express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import authRoutes from "./modules/auth/authRoutes.js";
import documentRoutes from "./modules/document/documentRoute.js";
import "./config/passport.js";

const app = Express();

app.use(Express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/doc", documentRoutes);

app.get("/", (req, res) => {
  res.send("Note Mesh Backend Is Running");
});

export default app;
