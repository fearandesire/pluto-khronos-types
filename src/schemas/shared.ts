/**
 * @group Shared
 * Shared schemas and types used across multiple features
 */
import { z } from 'zod';

/**
 * Schema for BullMQ job metadata
 * @group Queue
 */
export const bullMqMetadataSchema = z
	.looseObject({
		publishedAt: z
			.union([z.date(), z.string().transform((val) => new Date(val))])
			.pipe(z.date())
			.describe('Timestamp when the event was published'),
		eventId: z.string().describe('Unique identifier for tracking the event'),
	})
	.describe('Common metadata structure for BullMQ jobs');

/**
 * Type representing BullMQ job metadata
 * @group Queue
 */
export type BullMqMetadata = z.infer<typeof bullMqMetadataSchema>;
