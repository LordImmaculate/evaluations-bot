import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: []
});

try {
  if (client.application) {
    await client.application.commands.set([]);
    console.log("Successfully cleared all global application commands.");
  }
} catch (error) {
  console.error("Failed to clear global commands:", error);
}

client.login(process.env.DISCORD_TOKEN);
