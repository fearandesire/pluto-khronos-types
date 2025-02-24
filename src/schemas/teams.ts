/**
 * @group Teams
 * @description Schemas for team-related data
 */
import { z } from 'zod';

/**
 * @description Schema for team names in a match
 * @group Teams
 */
export const matchTeamsSchema = z
	.object({
		home_team: z.string().describe('Name of the home team'),
		away_team: z.string().describe('Name of the away team'),
	})
	.describe('Team names in a match');

/**
 * @description Schema for team abbreviations
 * @group Teams
 */
export const teamAbbreviationsSchema = z
	.object({
		homeTeamShortName: z
			.string()
			.describe('Short name/abbreviation of home team'),
		awayTeamShortName: z
			.string()
			.describe('Short name/abbreviation of away team'),
	})
	.describe('Team abbreviations');

export type MatchTeams = z.infer<typeof matchTeamsSchema>;
export type TeamAbbreviations = z.infer<typeof teamAbbreviationsSchema>;
