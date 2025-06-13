import mongoose from "mongoose";
import config from "./config/index.js";
import app from "./app.js";

async function main() {
  try {
    await mongoose.connect(config.mongouri);
    app.listen(config.port, () => {
      console.log(`Note Mesh Backend is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
