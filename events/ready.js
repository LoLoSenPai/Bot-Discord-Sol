require("dotenv").config();
// const { startMonitoring } = require('./walletMonitor');

const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(
      process.env.DATABASETOKEN || "",
      {
        keepAlive: true,
      },
      mongoose.set("strictQuery", false)
    );
    if (mongoose.connection) {
      console.log("MongoDB connected successfully");
    } else {
      console.log("MongoDB not connected");
    }

    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setActivity("with your mom", { type: "PLAYING" });

    // startMonitoring(client);
  },
};