require("dotenv").config();

const mongoose = require("mongoose");
// const { Client, Message, MessageFlags } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    await mongoose.connect(
      process.env.databaseToken || "",
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
  },
};
    // const channel = "795007593259991053";
    // const emojis = ["👍", "🥳", "🚀", "🔫", "⚗️"];
    // const tokenList = ["MjgwNTE0MDk4NTk5NDI4MDk3.G7b_oC.IOjsQJbzd0qHMf-XsJAX6H7vT-XfzRRxsBKlU4", "MjgwNTE0MDk4NTk5NDI4MDk3.GqRtlX.UXqGnOBmhXDzYwLCxF7ULJPzDLl5GizA7mYnro"];
    
    // client.on("messageCreate", async (message) => {
    //   if (message.channel.id === channel) {
    //     try {
    //       for (const emoji of emojis) {
    //         await message.react(emoji);
    //       }
    //     } catch (error) {
    //       console.error("Failed to add reactions", error);
    //     }
    //   }
    // });

