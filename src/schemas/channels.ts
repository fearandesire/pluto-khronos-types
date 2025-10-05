import type { Team } from 'resolve-team';
/**
 * @group Channels
 * Schemas for managing Discord channel-related operations
 */
import { z } from 'zod';
import { matchOddsSchema } from './betting';
import { colorResolvableSchema } from './colors';
import { guildConfigSchema } from './guilds';
import { matchMetadataSchema } from './match-metadata';
import { bullMqMetadataSchema } from './shared';
import { sportsServingSchema, teamRecordsResultSchema } from './sports';
import { matchTeamsSchema } from './teams';

/**
 * Schema for channel deletion job data
 * @group Channel Deletion
 */
export const channelDeletionJobSchema = z
	.object({
		channelName: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Channel name is required.' }
						: { message: 'Channel name must be a string.' },
			})
			.describe('Name of the channel to be deleted'),
		jobId: z
			.string({ error: 'Job ID must be a string if provided.' })
			.optional()
			.describe('Optional unique identifier for the deletion job'),
	})
	.describe('BullMQ Schema structure for channel deletion jobs');

/**
 * Schema for channel deletion operation results
 * @group Channel Deletion
 */
export const channelDeletionResultSchema = z
	.object({
		success: z
			.boolean({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Success status is required.' }
						: { message: 'Success status must be a boolean.' },
			})
			.describe('Whether the deletion operation was successful'),
		channelName: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Channel name is required.' }
						: { message: 'Channel name must be a string.' },
			})
			.describe('Name of the channel that was processed'),
		error: z
			.string({ error: 'Error message must be a string if present.' })
			.optional()
			.describe('Error message if deletion failed'),
	})
	.describe('BullMQ Schema structure for channel deletion results');

/**
 * Schema for channel deletion event data
 * @group Channel Deletion
 */
export const channelDeletionEventSchema = z
	.object({
		channelIds: z
			.array(
				z.string({ error: 'Each channel ID in the array must be a string.' }),
				{
					error: (issue) =>
						issue.input === undefined
							? { message: 'An array of channel IDs is required.' }
							: { message: 'Channel IDs must be provided as an array.' },
				},
			)
			.describe('Array of channel IDs to be deleted from Discord'),
		metadata: z
			.object({
				publishedAt: z
					.date({
						error: (issue) =>
							issue.input === undefined
								? { message: 'Published timestamp is required.' }
								: { message: 'Published at must be a valid date.' },
					})
					.describe('Timestamp when the deletion event was published'),
				eventId: z
					.string({
						error: (issue) =>
							issue.input === undefined
								? { message: 'Event ID is required.' }
								: { message: 'Event ID must be a string.' },
					})
					.describe('Unique identifier for tracking the deletion event'),
			})
			.describe('Metadata associated with the channel deletion event'),
	})
	.describe('BullMQ Schema structure for channel deletion events data');

/**
 * Schema for aggregated channel information
 * @group Channel Data
 */
export const channelAggregatedSchema = z
	.looseObject({
		id: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Channel ID is required.' }
						: { message: 'Channel ID must be a string.' },
			})
			.describe('Unique identifier for the channel'),
		sport: sportsServingSchema,
		created: z
			.boolean({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Creation status is required.' }
						: { message: 'Creation status must be a boolean.' },
			})
			.describe(
				'Whether the channel has been created in Discord [DEPRECATED FLAG]',
			),
		gametime: z
			.union([z.date(), z.string().transform((val) => new Date(val))])
			.pipe(z.date())
			.describe('Scheduled time for the game/match'),
		channelname: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Channel name is required.' }
						: { message: 'Channel name must be a string.' },
			})
			.describe('Name of the Discord channel'),
		matchOdds: matchOddsSchema,
		...matchTeamsSchema.shape,
		metadata: matchMetadataSchema.nullable().optional(),
	})
	.describe('Aggregated channel information including match and odds details');

/**
 * Schema for match embed display data
 * @group Channel Creation
 */
export const matchEmbedDisplaySchema = z
	.object({
		favored: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Favored team name is required.' }
						: { message: 'Favored team name must be a string.' },
			})
			.describe('Team favored to win'),
		favoredTeamClr: colorResolvableSchema.describe(
			'Color for the favored team',
		),
		home_team: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Home team name is required.' }
						: { message: 'Home team name must be a string.' },
			})
			.describe('Full name of home team'),
		homeTeamShortName: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Home team short name is required.' }
						: { message: 'Home team short name must be a string.' },
			})
			.describe('Short name/abbreviation of home team'),
		away_team: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Away team name is required.' }
						: { message: 'Away team name must be a string.' },
			})
			.describe('Full name of away team'),
		awayTeamShortName: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Away team short name is required.' }
						: { message: 'Away team short name must be a string.' },
			})
			.describe('Short name/abbreviation of away team'),
		bettingChanId: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Betting channel ID is required.' }
						: { message: 'Betting channel ID must be a string.' },
			})
			.describe('ID of the betting channel'),
		header: z
			.string({
				error: (issue) =>
					issue.input === undefined
						? { message: 'Embed header is required.' }
						: { message: 'Embed header must be a string.' },
			})
			.describe('Header text for the match embed'),
		sport: sportsServingSchema.describe('Sport type for the match'),
		records: teamRecordsResultSchema
			.nullable()
			.optional()
			.describe('Optional team records'),
	})
	.describe('Data structure for match embed display formatting');

/**
 * Schema for guild data with channel creation eligibility
 * @group Guilds
 */
export const channelEligibleGuildSchema = z
	.looseObject({
		...guildConfigSchema.shape,
		eligibleMatches: z
			.array(z.string({ error: 'Each match ID must be a string.' }), {
				error: (issue) =>
					issue.input === undefined
						? { message: 'Eligible matches array is required.' }
						: { message: 'Eligible matches must be an array.' },
			})
			.describe('List of match IDs eligible for channel creation'),
	})
	.describe('Guild data for channel creation eligibility');

/**
 * Schema for channel creation events
 * @group Channel Creation
 */
export const channelCreationEventSchema = z
	.looseObject({
		channel: channelAggregatedSchema,
		guild: channelEligibleGuildSchema,
		metadata: bullMqMetadataSchema.nullable().optional(),
	})
	.describe('Event data for channel creation operations');

/**
 * Schema for incoming channel data from Pluto
 * @group Channel Data
 */
export const incomingChannelDataSchema = z
	.object({
		channels: z
			.array(channelAggregatedSchema, {
				error: (issue) =>
					issue.input === undefined
						? { message: 'Channels array is required.' }
						: { message: 'Channels must be an array.' },
			})
			.describe('Array of channel data'),
		guilds: z
			.array(channelEligibleGuildSchema, {
				error: (issue) =>
					issue.input === undefined
						? { message: 'Guilds array is required.' }
						: { message: 'Guilds must be an array.' },
			})
			.describe('Array of eligible guild data'),
	})
	.describe('Schema for Pluto to process channel creation events');

export const ChannelWithGuildAggregatedSchema = z
	.object({
		channel: channelAggregatedSchema,
		guild: channelEligibleGuildSchema,
	})
	.describe(
		'Combined data structure of a channel that will be created and the guild information paired with it',
	);
/**
 * Pluto aggregated data structure when creating a channel
 * Pluto adds the favored team and match image
 * @group Channel Creation
 */
export const channelEmbedPayloadSchema =
	ChannelWithGuildAggregatedSchema.extend({
		metadata: z.object(
			{
				favoredTeamInfo: z.custom<Team>().describe('Resolved team information'),
				matchImg: z
					.instanceof(Buffer, { message: 'Match image must be a Buffer.' })
					.nullable()
					.describe('Match image buffer'),
				...matchMetadataSchema.shape,
			},
			{ error: 'Invalid Channel Embed Payload metadata received' },
		),
	}).describe('Data required to create a channel and send an embed');

export type ChannelWithGuildAggregated = z.infer<
	typeof ChannelWithGuildAggregatedSchema
>;

export type ChannelEmbedPayload = z.infer<typeof channelEmbedPayloadSchema>;
export type ChannelEligibleGuild = z.infer<typeof channelEligibleGuildSchema>;

export type ChannelDeletionJob = z.infer<typeof channelDeletionJobSchema>;
export type ChannelDeletionResult = z.infer<typeof channelDeletionResultSchema>;
export type ChannelDeletionEvent = z.infer<typeof channelDeletionEventSchema>;
export type ChannelAggregated = z.infer<typeof channelAggregatedSchema>;
export type MatchEmbedDisplay = z.infer<typeof matchEmbedDisplaySchema>;
export type ChannelCreationEvent = z.infer<typeof channelCreationEventSchema>;
export type IncomingChannelData = z.infer<typeof incomingChannelDataSchema>;
