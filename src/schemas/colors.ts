import type { ColorResolvable as DiscordColorResolvable } from 'discord.js';
/**
 * @group Colors
 * Schemas for Discord color-related types and validations
 */
import { z } from 'zod';

/**
 * Schema for Discord.js color values, supporting hex, integer, and named colors
 * @group Colors
 */
export const colorResolvableSchema = z
	.union([
		z
			.string()
			.regex(/^#[0-9A-Fa-f]{6}$/)
			.describe('Hex color code in #RRGGBB format'),
		z
			.number()
			.int()
			.min(0)
			.max(0xffffff)
			.describe('Integer color value between 0 and 16777215'),
		z
			.enum([
				'DEFAULT',
				'WHITE',
				'AQUA',
				'GREEN',
				'BLUE',
				'YELLOW',
				'PURPLE',
				'LUMINOUS_VIVID_PINK',
				'FUCHSIA',
				'GOLD',
				'ORANGE',
				'RED',
				'GREY',
				'NAVY',
				'DARK_AQUA',
				'DARK_GREEN',
				'DARK_BLUE',
				'DARK_PURPLE',
				'DARK_VIVID_PINK',
				'DARK_GOLD',
				'DARK_ORANGE',
				'DARK_RED',
				'DARK_GREY',
				'DARKER_GREY',
				'LIGHT_GREY',
				'DARK_NAVY',
				'BLURPLE',
				'GREYPLE',
				'DARK_BUT_NOT_BLACK',
				'NOT_QUITE_BLACK',
				'RANDOM',
			])
			.describe('Discord.js predefined color names'),
	])
	.transform((val) => val as unknown as DiscordColorResolvable)
	.describe(
		'Discord.js ColorResolvable - supports hex codes, integers, and predefined color names',
	);

/**
 * Type representing a Discord.js color value
 * Directly compatible with Discord.js ColorResolvable type when discord.js is installed
 * @group Colors
 */
export type ColorResolvable = z.output<typeof colorResolvableSchema>;
