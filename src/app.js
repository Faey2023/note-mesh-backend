import Express from "express";
import cors from "cors";

const app = Express();

app.use(Express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Note Mesh Backend Is Running");
});

export default app;
