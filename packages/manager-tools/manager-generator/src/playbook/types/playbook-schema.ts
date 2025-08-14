/**
 * @file playbook-schema.ts
 */
import { z } from 'zod';

import { normalizeBasePath, normalizeCombined } from '../../kernel/tokens/tokens-helper';
import { TokenMap } from '../../kernel/types/tokens-types';
import { REGIONS, SUB_UNIVERSES, UNIVERSES } from '../config/api-static-data';

/** Accept braces, colons, dots, underscores, dashes. */
const pathRule = /^\/[A-Za-z0-9\/_\-\{\}\.:]*$/;

export const AnswersSchema = z.object({
  appName: z.string().min(1, 'appName is required'),

  description: z.string().trim().optional(),
  appType: z.string().trim().optional(),

  universe: z
    .string()
    .min(1, 'universe is required')
    .refine((v) => UNIVERSES.includes(v), `universe must be one of: ${UNIVERSES.join(', ')}`),

  subUniverse: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || SUB_UNIVERSES.includes(v),
      `subUniverse must be one of: ${SUB_UNIVERSES.join(', ')}`,
    ),

  region: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || REGIONS.includes(v),
      `region must be one of: ${REGIONS.join(', ')}`,
    ),

  flavor: z.string().optional(),
  usePreset: z.boolean().default(false),
  userEmail: z.string().email().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),

  // IMPORTANT: preprocess does the tolerant normalization
  mainApiPath: z.preprocess(
    normalizeBasePath,
    z.string().min(1, 'mainApiPath is required').regex(pathRule, 'mainApiPath must start with "/"'),
  ),

  listingEndpointPath: z.preprocess(
    normalizeCombined,
    z
      .string()
      .min(1, 'listingEndpointPath is required')
      .regex(pathRule, 'listingEndpointPath must start with "/"'),
  ),

  dashboardEndpointPath: z.preprocess(
    normalizeCombined,
    z
      .string()
      .min(1, 'dashboardEndpointPath is required')
      .regex(pathRule, 'dashboardEndpointPath must start with "/"'),
  ),

  serviceKey: z.string().trim().optional(),
});

export type ValidAnswers = z.infer<typeof AnswersSchema>;

export const TokenMapSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
) as z.ZodType<TokenMap>;
