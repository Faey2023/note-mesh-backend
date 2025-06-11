import Express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = Express();

app.use(Express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

//routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Note Mesh Backend Is Running");
});

export default app;
