/**
 * @group Guilds
 * Schemas and types for Discord guild (server) configurations
 */
import { z } from 'zod';

/**
 * Base schema for guild configuration
 * @group Guilds
 */
export const guildConfigSchema = z
	.object({
		guildId: z.string().describe('Discord guild (server) ID'),
		bettingChannelId: z
			.string()
			.describe('ID of the channel where betting takes place'),
		gameCategoryId: z
			.string()
			.describe('ID of the category where game channels are created'),
		preferredTeams: z
			.array(z.string())
			.optional()
			.describe(
				'List of teams the guild follows. May be an empty array if the guild follows no teams, allowing them to receive data for all events for their defined sport',
			),
		sport: z.string().describe('Sport type for this guild configuration'),
	})
	.describe('Base Discord Guild configuration');

/**
 * Type representing base guild configuration
 * @group Guilds
 */
export type GuildConfig = z.infer<typeof guildConfigSchema>;
