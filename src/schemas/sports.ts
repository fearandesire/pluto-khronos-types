/**
 * @group Sports
 * Schemas and types for sports-related data
 */
import { z } from 'zod';

/**
 * Constant object defining supported sports
 * @group Sports
 */
export const SportsServing = {
	nba: 'nba',
	nfl: 'nfl',
} as const;

/**
 * Schema for supported sports in the application
 * @group Sports
 */
export const sportsServingSchema = z
	.enum(['nba', 'nfl'])
	.describe('Sports we support in the APIs');

/**
 * Schema for a team's record information
 * @group Sports
 */
export const teamRecordSchema = z
	.object({
		display_name: z
			.string()
			.optional()
			.describe('Human-readable team name as ESPN reports it'),
		abbreviation: z
			.string()
			.optional()
			.describe('ESPN team abbreviation (e.g. "BOS", "LAL")'),
		total_record: z
			.string()
			.nullable()
			.describe(
				"Team's total win-loss record, or null when ESPN returned the team but no parseable record",
			),
		home_record: z
			.string()
			.nullable()
			.optional()
			.describe('Home win-loss record'),
		away_record: z
			.string()
			.nullable()
			.optional()
			.describe('Away win-loss record'),
		playoff_record: z
			.string()
			.nullable()
			.optional()
			.describe('Postseason win-loss record (only populated during playoffs)'),
	})
	.describe('Team record structure');

/**
 * Schema for active playoff series metadata associated with a matchup
 * @group Sports
 */
export const matchupSeriesSchema = z
	.object({
		round: z
			.string()
			.optional()
			.describe(
				'Playoff round name (e.g. "First Round", "Conference Finals", "Finals")',
			),
		summary: z
			.string()
			.optional()
			.describe('Human-readable series summary, e.g. "BOS leads series 3-2"'),
		home_wins: z.number().optional().describe('Series wins for the home team'),
		away_wins: z.number().optional().describe('Series wins for the away team'),
		total_games: z
			.number()
			.optional()
			.describe('Series format length (typically 7)'),
		completed: z
			.boolean()
			.optional()
			.describe('True once the series is decided'),
	})
	.describe('Active playoff series metadata for a matchup');

/**
 * Schema for both teams' record information in a match
 * @group Sports
 */
export const teamRecordsResultSchema = z
	.object({
		home_team: teamRecordSchema.describe("Home team's record"),
		away_team: teamRecordSchema.describe("Away team's record"),
		series: matchupSeriesSchema
			.nullable()
			.optional()
			.describe(
				'Active playoff series info for the matchup — only populated when ESPN exposes a postseason series for the date',
			),
	})
	.describe('Team Record information for both teams in a match');

/**
 * Type representing a team's record
 * @group Sports
 */
export type TeamRecord = z.infer<typeof teamRecordSchema>;

/**
 * Type representing active playoff series metadata for a matchup
 * @group Sports
 */
export type MatchupSeries = z.infer<typeof matchupSeriesSchema>;

/**
 * Type representing both teams' records in a match

 * @group Sports
 */
export type TeamRecordsResult = z.infer<typeof teamRecordsResultSchema>;

/**
 * Type representing the sports we support
 * @group Sports
 */
export type SportsServing = z.infer<typeof sportsServingSchema>;
