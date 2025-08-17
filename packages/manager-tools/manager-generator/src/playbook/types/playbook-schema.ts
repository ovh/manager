/**
 * @file playbook-schema.ts
 * @description
 * Zod schema describing the interactive generator "answers" object.
 *
 * This schema validates and normalizes the inputs collected when scaffolding a new app.
 * - Performs strict checks against known universes, sub-universes, and regions
 * - Ensures API paths follow a safe pattern (leading slash, allowed chars)
 * - Normalizes paths using `normalizeBasePath` and `normalizeCombined`
 * - Provides type inference (`ValidAnswers`) for downstream TypeScript code
 *
 * Example of a valid "answers" object:
 * ```ts
 * {
 *   appName: "pci-storage",
 *   description: "PCI block storage UI",
 *   appType: "pci",
 *   universe: "public-cloud",
 *   subUniverse: "storage",
 *   region: "EU",
 *   flavor: "react",
 *   usePreset: true,
 *   userEmail: "dev@company.com",
 *   language: "ts",
 *   framework: "react",
 *   mainApiPath: "/v6/cloud",
 *   listingEndpointPath: "/v6/cloud/project/{serviceName}/volume",
 *   onboardingEndpointPath: "/v6/cloud/project/{serviceName}/volume/{volumeId}",
 *   serviceKey: "volume"
 * }
 * ```
 */
import { z } from 'zod';

import { normalizeBasePath, normalizeCombined } from '../../kernel/tokens/tokens-helper';
import { REGIONS, SUB_UNIVERSES, UNIVERSES } from '../config/api-config';

/** Regex: API paths must start with `/` and may include letters, digits, `/`, `_`, `-`, `{}`, `.`, `:`. */
const pathRule = /^\/[A-Za-z0-9\/_\-\{\}\.:]*$/;

/**
 * Helper: safe membership check for readonly arrays (e.g., `as const` arrays).
 */
const includesLoose = (arr: readonly string[], v: string) => arr.includes(v);

/**
 * Core Zod schema for generator answers.
 *
 * Each field is validated & normalized where appropriate:
 */
export const AnswersSchema = z.object({
  /** App name (used for folder, package, etc.). Required. */
  appName: z.string().min(1, 'appName is required'),

  /** Optional packageName for package.json. */
  packageName: z.string().trim().optional(),

  /** Optional human description for README, docs, etc. */
  description: z.string().trim().optional(),

  /** Freeform app type (e.g., "pci", "manager"). Used in token derivation. */
  appType: z.string().trim().optional(),

  /** High-level product universe (must match one of `UNIVERSES`). */
  universe: z
    .string()
    .min(1, 'universe is required')
    .refine((v) => includesLoose(UNIVERSES, v), `universe must be one of: ${UNIVERSES.join(', ')}`),

  /** Sub-universe classification (if any). Must match `SUB_UNIVERSES` when provided. */
  subUniverse: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || includesLoose(SUB_UNIVERSES, v),
      `subUniverse must be one of: ${SUB_UNIVERSES.join(', ')}`,
    ),

  /** Deployment region (EU, US, etc.). Must match `REGIONS` when provided. */
  region: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || includesLoose(REGIONS, v),
      `region must be one of: ${REGIONS.join(', ')}`,
    ),

  /** Optional app flavor (UI variant, product line, etc.). */
  flavor: z.string().optional(),

  /** If true, generator will use a preset config instead of asking all questions. */
  usePreset: z.boolean().default(false),

  /** Optional contact email (used for ownership metadata). */
  userEmail: z.string().email().optional(),

  /** Programming language (e.g., "js", "ts"). */
  language: z.string().optional(),

  /** UI framework (e.g., "react", "vue"). */
  framework: z.string().optional(),

  /**
   * Base API path (normalized).
   * Must start with `/`.
   *
   * Example: `/v6/cloud`
   */
  mainApiPath: z.preprocess(
    normalizeBasePath,
    z.string().min(1, 'mainApiPath is required').regex(pathRule, 'mainApiPath must start with "/"'),
  ),

  /**
   * Listing endpoint path (normalized).
   * Must start with `/`.
   *
   * Example: `/v6/cloud/project/{serviceName}/volume`
   */
  listingEndpointPath: z.preprocess(
    normalizeCombined,
    z
      .string()
      .min(1, 'listingEndpointPath is required')
      .regex(pathRule, 'listingEndpointPath must start with "/"'),
  ),

  /**
   * onboarding endpoint path (normalized).
   * Must start with `/`.
   *
   * Example: `/v6/cloud/project/{serviceName}/volume/{volumeId}`
   */
  onboardingEndpointPath: z.preprocess(
    normalizeCombined,
    z
      .string()
      .min(1, 'onboardingEndpointPath is required')
      .regex(pathRule, 'onboardingEndpointPath must start with "/"'),
  ),

  /** Optional key for the main service resource (e.g. "volumeId"). */
  serviceKey: z.string().trim().optional(),
});

/** TypeScript type for validated answers. */
export type ValidAnswers = z.infer<typeof AnswersSchema>;
