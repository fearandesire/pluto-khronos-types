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
	.object({
		publishedAt: z.date().describe('Timestamp when the event was published'),
		eventId: z.string().describe('Unique identifier for tracking the event'),
	})
	.describe('Common metadata structure for BullMQ jobs');

/**
 * Type representing BullMQ job metadata
 * @group Queue
 */
export type BullMqMetadata = z.infer<typeof bullMqMetadataSchema>;
