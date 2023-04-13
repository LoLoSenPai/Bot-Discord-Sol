require("dotenv").config();

const mongoose = require("mongoose");
const { Client } = require("discord.js");

const filteredMembers = new Map();

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

    // Guild and role IDs
    // const guildId = "810287253401763851";
    // const roleIdToCheck = "1078696817438502962";
    // const roleName = "Petit Lapin";

    // const guild = await client.guilds.fetch(guildId);
    // console.log(`Guild: ${guild.name}`);

    // const roles = guild.roles.cache;
    // console.log(`Roles in guild ${guild.name}:`);
    // roles.forEach((role) => {
    //   return;
    // });

	// récupère le rôle spécifié
	// console.log(`Guild: ${guild.name}`);
	
	// Récupérer le rôle à vérifier
	// const roleToCheck = guild.roles.cache.find((role) => role.id === roleIdToCheck);
	// console.log(`roleToCheck: ${roleToCheck}`);
	
	// if (roleToCheck) {
	//   await roleToCheck.members.fetch();
	//   console.log(`Role ${roleName} has ${roleToCheck.members.size} members`);
	// } else {
	//   console.log(`Role ${roleName} not found`);
	// }
	 
  },
};
