/**
 * @group Channels
 * @description Schemas for managing Discord channel-related operations
 */
import { z } from 'zod';
import { matchOddsSchema } from './betting';
import { colorResolvableSchema } from './colors';
import { channelEligibleGuildSchema } from './guilds';
import { matchMetadataSchema } from './match-metadata';
import { bullMqMetadataSchema } from './shared';
import { sportsServingSchema, teamRecordsResultSchema } from './sports';
import { matchTeamsSchema } from './teams';

/**
 * @description Schema for channel deletion job data

 * @group Channel Deletion
 */
export const channelDeletionJobSchema = z
	.object({
		channelName: z.string().describe('Name of the channel to be deleted'),
		jobId: z
			.string()
			.optional()
			.describe('Optional unique identifier for the deletion job'),
	})
	.describe('BullMQ Schema structure for channel deletion jobs');

/**
 * @description Schema for channel deletion operation results

 * @group Channel Deletion
 */
export const channelDeletionResultSchema = z
	.object({
		success: z
			.boolean()
			.describe('Whether the deletion operation was successful'),
		channelName: z.string().describe('Name of the channel that was processed'),
		error: z.string().optional().describe('Error message if deletion failed'),
	})
	.describe('BullMQ Schema structure for channel deletion results');

/**
 * @description Schema for channel deletion event data

 * @group Channel Deletion
 */
export const channelDeletionEventSchema = z
	.object({
		channelIds: z
			.array(z.string())
			.describe('Array of channel IDs to be deleted from Discord'),
		metadata: z
			.object({
				publishedAt: z
					.date()
					.describe('Timestamp when the deletion event was published'),
				eventId: z
					.string()
					.describe('Unique identifier for tracking the deletion event'),
			})
			.describe('Metadata associated with the channel deletion event'),
	})
	.describe('BullMQ Schema structure for channel deletion events data');

/**
 * @description Schema for aggregated channel information

 * @group Channel Data
 */
export const channelAggregatedSchema = z
	.object({
		id: z.string().describe('Unique identifier for the channel'),
		sport: sportsServingSchema,
		created: z
			.boolean()
			.describe('Whether the channel has been created in Discord'),
		gametime: z.date().describe('Scheduled time for the game/match'),
		channelname: z.string().describe('Name of the Discord channel'),
		matchOdds: matchOddsSchema,
		...matchTeamsSchema.shape,
		metadata: matchMetadataSchema.optional(),
	})
	.describe('Aggregated channel information including match and odds details');

/**
 * @description Schema for match embed preparation data

 * @group Channel Embeds
 */
export const prepareMatchEmbedSchema = z
	.object({
		favored: z.string().describe('Team favored to win'),
		favoredTeamClr: colorResolvableSchema.describe(
			'Color for the favored team',
		),
		home_team: z.string().describe('Full name of home team'),
		homeTeamShortName: z
			.string()
			.describe('Short name/abbreviation of home team'),
		away_team: z.string().describe('Full name of away team'),
		awayTeamShortName: z
			.string()
			.describe('Short name/abbreviation of away team'),
		bettingChanId: z.string().describe('ID of the betting channel'),
		header: z.string().describe('Header text for the match embed'),
		sport: sportsServingSchema.describe('Sport type for the match'),
		records: teamRecordsResultSchema
			.nullable()
			.optional()
			.describe('Optional team records'),
	})
	.describe('Data structure for preparing match embed messages');

/**
 * @description Schema for channel creation events

 * @group Channel Creation
 */
export const channelCreationEventSchema = z
	.object({
		channel: channelAggregatedSchema,
		guild: channelEligibleGuildSchema,
		metadata: bullMqMetadataSchema,
	})
	.describe('Event data for channel creation operations');

/**
 * @description Schema for incoming channel data from Pluto

 * @group Channel Data
 */
export const incomingChannelDataSchema = z
	.object({
		channels: z
			.array(channelAggregatedSchema)
			.describe('Array of channel data'),
		guilds: z
			.array(channelEligibleGuildSchema)
			.describe('Array of eligible guild data'),
	})
	.describe('Schema for Pluto to process channel creation events');

export type ChannelDeletionJob = z.infer<typeof channelDeletionJobSchema>;
export type ChannelDeletionResult = z.infer<typeof channelDeletionResultSchema>;
export type ChannelDeletionEvent = z.infer<typeof channelDeletionEventSchema>;
export type ChannelAggregated = z.infer<typeof channelAggregatedSchema>;
export type PrepareMatchEmbed = z.infer<typeof prepareMatchEmbedSchema>;
export type ChannelCreationEvent = z.infer<typeof channelCreationEventSchema>;
export type IncomingChannelData = z.infer<typeof incomingChannelDataSchema>;
