/**
 * @group Metadata
 * @description Common metadata schemas used across features
 */
import { z } from "zod";
import { teamRecordsResultSchema } from "./sports";

/**
 * @description Schema for match metadata
 * @group Metadata
 */
export const matchMetadataSchema = z
	.object({
		headline: z.string().optional().nullable().describe("Match headline"),
		records: teamRecordsResultSchema
			.optional()
			.nullable()
			.describe("Team records information"),
	})
	.describe("Match metadata information");

export type MatchMetadata = z.infer<typeof matchMetadataSchema>;
