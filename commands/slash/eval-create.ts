import type { SlashCommand } from "@/index";
import {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  InteractionContextType,
  ChatInputCommandInteraction,
  EmbedBuilder
} from "discord.js";

const evalCreateCommand: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("eval-create")
    .setDescription("Create a new evaluation")
    .addStringOption((option) =>
      option
        .setName("link")
        .setDescription("The Ufora link to the evaluation.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription("The name of the class for the evaluation.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title of the evaluation.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("deadline")
        .setDescription("The deadline in (in UNIX timestamp format)")
        .setRequired(true)
    )
    .setIntegrationTypes(
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall
    )
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    ),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const link = interaction.options.getString("link");
    const title = interaction.options.getString("title");
    const vak = interaction.options.getString("class");
    const deadline = interaction.options.getString("deadline");

    try {
      await interaction.deferReply();

      if (!link || !title || !deadline || !vak) {
        await interaction.editReply({
          content:
            "Missing required options. Please provide a link, title, class, and deadline."
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(`Vak: ${vak}`)
        .setURL(link)
        .addFields({
          name: "Deadline:",
          value: `<t:${deadline}:F> (<t:${deadline}:R>)`
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error executing slash command:", error);
      await interaction.editReply({
        content: "There was an error while executing this command!"
      });
    }
  }
};

export default evalCreateCommand;
