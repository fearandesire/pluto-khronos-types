// https://github.com/discordjs/discord.js/blob/main/packages/discord.js/src/util/Util.js#L258
// https://discord.js.org/docs/packages/discord.js/main/ColorResolvable:TypeAlias
export type ColorResolvable =
	| `#${string}`
	| "DEFAULT"
	| "WHITE"
	| "AQUA"
	| "GREEN"
	| "BLUE"
	| "YELLOW"
	| "PURPLE"
	| "LUMINOUS_VIVID_PINK"
	| "FUCHSIA"
	| "GOLD"
	| "ORANGE"
	| "RED"
	| "GREY"
	| "NAVY"
	| "DARK_AQUA"
	| "DARK_GREEN"
	| "DARK_BLUE"
	| "DARK_PURPLE"
	| "DARK_VIVID_PINK"
	| "DARK_GOLD"
	| "DARK_ORANGE"
	| "DARK_RED"
	| "DARK_GREY"
	| "DARKER_GREY"
	| "LIGHT_GREY"
	| "DARK_NAVY"
	| "BLURPLE"
	| "GREYPLE"
	| "DARK_BUT_NOT_BLACK"
	| "NOT_QUITE_BLACK"
	| "RANDOM"
	| number;
