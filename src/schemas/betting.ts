/**
 * @group Betting
 * @description Schemas for betting and odds-related data
 */
import { z } from "zod";

/**
 * @description Schema for match betting odds
 * @group Betting
 */
export const matchOddsSchema = z
	.object({
		favored: z.string().describe("Team favored to win"),
		home_team_odds: z.number().describe("Betting odds for home team"),
		away_team_odds: z.number().describe("Betting odds for away team"),
	})
	.describe("Match betting odds information");

export type MatchOdds = z.infer<typeof matchOddsSchema>;
