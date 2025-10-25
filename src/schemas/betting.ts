/**
 * @group Betting
 * Schemas for betting and odds-related data
 */
import { z } from 'zod';

/**
 * Schema for match betting odds
 * @group Betting
 */
export const matchOddsSchema = z
	.object({
		favored: z.string().describe('Team favored to win'),
		home_team_odds: z.number().describe('Betting odds for home team'),
		away_team_odds: z.number().describe('Betting odds for away team'),
	})
	.describe('Match betting odds information');

export type MatchOdds = z.infer<typeof matchOddsSchema>;

/**
 * Schema for a pushed bet result (tie game refund)
 * @group Betting
 */
export const betslipPushSchema = z
	.object({
		userid: z.string().describe('User ID who placed the bet'),
		amount: z.number().describe('Amount refunded to user'),
		betid: z.number().describe('Unique bet identifier'),
		team: z.string().describe('Team the user bet on'),
	})
	.describe('Information about a bet that was pushed due to a tie game');

export type IBetslipPush = z.infer<typeof betslipPushSchema>;

/**
 * Schema for bet result notification payload
 * @group Betting
 */
export const notificationBetResultsSchema = z
	.object({
		winners: z.array(z.any()).nullable().describe('Array of winning bets'),
		losers: z.array(z.any()).nullable().describe('Array of losing bets'),
		pushes: z
			.array(betslipPushSchema)
			.optional()
			.describe('Array of pushed bets from tie games'),
	})
	.describe('Notification payload for bet results including pushes from ties');

export type INotificationBetResults = z.infer<
	typeof notificationBetResultsSchema
>;
