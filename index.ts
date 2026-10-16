import {
  Client,
  GatewayIntentBits,
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
  Collection,
  type Interaction,
  ChatInputCommandInteraction,
  type SlashCommandOptionsOnlyBuilder
} from "discord.js";
import evalCreateCommand from "./commands/slash/eval-create";

// Define interfaces for both command types
export type ContextMenuCommand = {
  data: ContextMenuCommandBuilder;
  execute: (interaction: MessageContextMenuCommandInteraction) => Promise<void>;
};

export type SlashCommand = {
  data: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

// Create a union type for both command types
type BaseCommand = ContextMenuCommand | SlashCommand;

// Augment the Client class to hold a collection of commands
declare module "discord.js" {
  interface Client {
    commands: Collection<string, BaseCommand>;
  }
}

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages // Required for message-related commands
  ]
});

client.commands = new Collection<string, BaseCommand>();

client.commands.set(evalCreateCommand.data.name, evalCreateCommand);

// Log when the bot is ready
client.once("clientReady", async () => {
  console.log(`Ready! Logged in as ${client.user?.tag}`);

  // Register all commands with Discord's API
  try {
    if (client.application) {
      const commands = client.commands.map((cmd) => cmd.data.toJSON());
      await client.application.commands.set(commands);
      console.log("Successfully registered all application commands.");
    }
  } catch (error) {
    console.error("Failed to register application commands:", error);
  }
});

// Listen for interactions (this is where the command is executed)
client.on("interactionCreate", async (interaction: Interaction) => {
  if (
    interaction.isMessageContextMenuCommand() ||
    interaction.isChatInputCommand()
  ) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      await command.execute(interaction as any);
    } catch (error) {
      console.error(`Error executing command:`, error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "There was an error while executing this command!"
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true
        });
      }
    }
  }
});

// Log in to Discord with the bot's token
client.login(process.env.DISCORD_TOKEN);
