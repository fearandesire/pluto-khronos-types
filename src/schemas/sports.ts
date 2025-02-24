/**
 * @group Sports
 * @description Schemas and types for sports-related data
 */
import { z } from "zod";

/**
 * @description Constant object defining supported sports
 * @group Sports
 */
export const SportsServing = {
	nba: "nba",
	nfl: "nfl",
} as const;

/**
 * @description Schema for supported sports in the application
 * @group Sports
 */
export const sportsServingSchema = z
	.enum(["nba", "nfl"])
	.describe("Sports we support in the APIs");

/**
 * @description Schema for a team's record information
 * @group Sports
 */
export const teamRecordSchema = z
	.object({
		total_record: z.string().describe("Team's total win-loss record"),
	})
	.describe("Team record structure");

/**
 * @description Schema for both teams' record information in a match
 * @group Sports
 */
export const teamRecordsResultSchema = z
	.object({
		home_team: teamRecordSchema.describe("Home team's record"),
		away_team: teamRecordSchema.describe("Away team's record"),
	})
	.describe("Team Record information for both teams in a match");

/**
 * @description Type representing a team's record
 * @group Sports
 */
export type TeamRecord = z.infer<typeof teamRecordSchema>;

/**
 * @description Type representing both teams' records in a match

 * @group Sports
 */
export type TeamRecordsResult = z.infer<typeof teamRecordsResultSchema>;
