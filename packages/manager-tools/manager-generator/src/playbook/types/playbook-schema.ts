/**
 * @file playbook-schema.ts
 * @description Zod schemas for the generator CLI.
 * Keeps legacy fields (description, usePreset, optional appType, etc.)
 * and adds minimal validation to make tests pass.
 */
import { z } from 'zod';

import { TokenMap } from '../../kernel/types/tokens-types';
import { REGIONS, SUB_UNIVERSES, UNIVERSES } from '../config/api-static-data';

/** Leading-slash, URL-ish path (no spaces). */
const pathRule = /^\/[A-Za-z0-9/_-]*$/;

/**
 * Answers provided to the generator (CLI flags / answers.json / prompts).
 * - Preserves legacy optional fields and defaults.
 * - Validates `region` against REGIONS (so `MARS` fails).
 * - Requires API paths and enforces leading `/` (so “missing mainApiPath” fails).
 */
export const AnswersSchema = z.object({
  /** Application name (non-empty string). */
  appName: z.string().min(1, 'appName is required'),

  /** Optional application description. */
  description: z.string().trim().optional(),

  /** App type: keep optional (tokens-main derives default). */
  appType: z.enum(['pci', 'full', 'zimbra', 'iceberg', 'v2', 'v6']).optional(),

  /** Universe (keep liberal; refined against known list). */
  universe: z
    .string()
    .min(1, 'universe is required')
    .refine((v) => UNIVERSES.includes(v), `universe must be one of: ${UNIVERSES.join(', ')}`),

  /** Optional sub-universe (if present, validate against list). */
  subUniverse: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || SUB_UNIVERSES.includes(v),
      `subUniverse must be one of: ${SUB_UNIVERSES.join(', ')}`,
    ),

  /** Region: optional, but if present must be one of REGIONS (invalid should fail). */
  region: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || REGIONS.includes(v),
      `region must be one of: ${REGIONS.join(', ')}`,
    ),

  /** Flavor/size (kept liberal). */
  flavor: z.string().optional(),

  /** Whether a preset is used (legacy; default false). */
  usePreset: z.boolean().default(false),

  /** Optional user email (format-checked if present). */
  userEmail: z.string().email().optional(),

  /** Optional language code (kept liberal unless you canonize). */
  language: z.string().optional(),

  /** Optional framework (kept liberal; your CLI suggests React). */
  framework: z.string().optional(),

  /** Required base API path (must start with '/'). */
  mainApiPath: z
    .string()
    .min(1, 'mainApiPath is required')
    .regex(pathRule, 'mainApiPath must start with "/"'),

  /** Required listing endpoint path (must start with '/'). */
  listingEndpointPath: z
    .string()
    .min(1, 'listingEndpointPath is required')
    .regex(pathRule, 'listingEndpointPath must start with "/"'),

  /** Required dashboard endpoint path (must start with '/'). */
  dashboardEndpointPath: z
    .string()
    .min(1, 'dashboardEndpointPath is required')
    .regex(pathRule, 'dashboardEndpointPath must start with "/"'),

  /** Optional explicit service key override. */
  serviceKey: z.string().trim().optional(),
});

/** Typed view of parsed answers. */
export type ValidAnswers = z.infer<typeof AnswersSchema>;

/**
 * Token map for templating (stringly-typed values OK; booleans normalized later).
 */
export const TokenMapSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
) as z.ZodType<TokenMap>;
