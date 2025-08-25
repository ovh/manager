/**
 * src/playbook/tokens-main.ts
 *
 * Builds the token map consumed by the templates under `template/`.
 * All produced tokens are plain strings so they can be injected directly
 * into source files (e.g., '{{listingApi}}', '{{mainApiPath}}').
 */
import { normalizeApiPath, shortPciSlug, toKebabCase } from '../kernel/tokens/tokens-helper';
import { BuildTokensInput, TokenMap } from '../kernel/types/tokens-types';
import { loadPreset } from '../presets/presets';
import { ValidAnswers } from './types/playbook-schema';
import {
  DashboardApi,
  GeneratorAnswers,
  ListingApi,
  ResolveCtx,
  Tokens,
} from './types/playbook-types';

/**
 * Type guard that checks whether a given value has a non-empty `mainApiPath` string.
 *
 * Useful for narrowing types in TypeScript: after calling this function,
 * the value is guaranteed to be of type {@link Tokens}.
 *
 * @param val - The value to check
 * @returns `true` if `val` is an object with a defined, non-empty `mainApiPath`
 *
 * @example
 * ```ts
 * const x: unknown = { mainApiPath: '/cloud' };
 *
 * if (hasMainApiPath(x)) {
 *   // x is now inferred as Tokens
 *   console.log(x.mainApiPath); // "/cloud"
 * }
 * ```
 */
export function hasMainApiPath(val: unknown): val is Tokens {
  if (typeof val !== 'object' || val === null) return false;
  const maybe = val as { mainApiPath?: unknown };
  return typeof maybe.mainApiPath === 'string' && maybe.mainApiPath.trim().length > 0;
}

/**
 * Build the core token map from generator/prompt answers.
 *
 * Resolves application metadata (name, slug, PCI normalization),
 * API paths, tracking tokens, and route flavor. Produces a `Tokens`
 * object where all values are strings, suitable for template replacement.
 *
 * @returns A structured `Tokens` object
 *
 * @example
 * ```ts
 * buildBaseTokens({ appName: "pci-billing", isPci: true });
 * // {
 * //   appNameKebab: "pci-billing",
 * //   isPci: "true",
 * //   mainApiPath: "/services",
 * //   ...
 * // }
 * ```
 * @param answers
 */
// eslint-disable-next-line complexity,max-lines-per-function
export function buildBaseTokens(answers: BuildTokensInput): Tokens {
  const appNameRaw = (answers as Partial<GeneratorAnswers>).appName?.trim() || 'MyApp';
  const appNameKebab = toKebabCase(appNameRaw);

  const defaultDescription = `${answers.appName} — OVHcloud Manager Application`;
  const repositoryDir = `packages/manager/apps/${appNameKebab}`;

  const isPci = (answers as Partial<GeneratorAnswers>).isPci ?? false;
  const routeFlavor = isPci ? 'pci' : 'generic';

  const rawSlug = toKebabCase(
    (answers as Partial<GeneratorAnswers>).appSlug?.trim() || appNameKebab,
  );
  const appSlug = isPci ? shortPciSlug(rawSlug) : rawSlug;

  const basePrefix =
    typeof (answers as Partial<GeneratorAnswers>).basePrefix === 'string'
      ? (answers as Partial<GeneratorAnswers>).basePrefix!.trim()
      : '';

  const listingApi: ListingApi =
    ((answers as Partial<GeneratorAnswers>).listingApi as ListingApi) ?? 'v6Iceberg';
  const dashboardApi: DashboardApi =
    ((answers as Partial<GeneratorAnswers>).dashboardApi as DashboardApi) ?? 'v6';

  // mainApiPath: prefer precomputed, else selected listingEndpoint.path, else default
  const directMain: string | undefined = hasMainApiPath(answers) ? answers.mainApiPath : undefined;
  const listingEndpoint = (answers as Partial<GeneratorAnswers>).listingEndpoint?.trim();
  const dashboardEndpoint = (answers as Partial<GeneratorAnswers>).dashboardEndpoint?.trim();
  const mainApiPath = normalizeApiPath(
    directMain ?? listingEndpoint ?? dashboardEndpoint ?? '/services',
  );

  // Tracking tokens
  const trackingLevel2 = (
    ((answers as Partial<GeneratorAnswers>).level2 ?? '120') as string
  ).toString();
  const trackingUniverse = (answers as Partial<GeneratorAnswers>).universe ?? 'Manager';
  const trackingSubUniverse = (answers as Partial<GeneratorAnswers>).subUniverse ?? 'Manager';

  // Listing datagrid service key
  const serviceKey =
    ((answers as Partial<GeneratorAnswers>).serviceKey ?? 'publicCloud-project').trim() ||
    'publicCloud-project';

  // chosen regions and universes
  const regions = (answers as Partial<GeneratorAnswers>).regions;
  const universes = (answers as Partial<GeneratorAnswers>).universes;

  return {
    appNameKebab,
    packageName: answers.packageName || `@ovh-ux/manager-${appNameKebab}-app`,
    isPci: String(isPci),
    routeFlavor,
    basePrefix,
    appSlug,
    mainApiPath,
    listingApi,
    listingEndpoint: listingEndpoint?.split('-')?.[0] || '',
    dashboardEndpoint: dashboardEndpoint?.split('-')?.[0] || '',
    dashboardApi,
    regions,
    universes,
    trackingLevel2,
    trackingUniverse,
    trackingSubUniverse,
    serviceKey,
    description: answers.description ?? defaultDescription,
    repositoryUrl: repositoryDir,
  };
}

/* -------------------------------------------------------------------------- */
/* Token resolution (presets + env overrides + base tokens)                   */
/* -------------------------------------------------------------------------- */

/**
 * Resolve a final token map for template injection.
 *
 * Resolution order (lowest → highest precedence):
 * 1. Preset tokens (from `ctx.presets`)
 * 2. Base tokens (from `buildBaseTokens(answers)`)
 * 3. Environment overrides (`ctx.envTokens`)
 *
 * @param answers - User answers from playbook prompts
 * @param ctx - Optional context: presets to load, environment overrides
 * @returns Promise resolving to a `TokenMap` (plain strings for injection)
 *
 * @example
 * ```ts
 * const tokens = await resolveTokens(
 *   { appName: "cloud", isPci: false },
 *   { presets: ["publicCloud"], envTokens: { customKey: "X" } }
 * );
 *
 * // tokens.customKey === "X"
 * // tokens.appNameKebab === "cloud"
 * ```
 */
export async function resolveTokens(
  answers: ValidAnswers,
  ctx: ResolveCtx = {},
): Promise<TokenMap> {
  // 1) Presets (lowest precedence)
  let merged: TokenMap = {};
  if (ctx.presets?.length) {
    for (const name of ctx.presets) {
      const preset = await loadPreset(name);
      if (preset?.tokens) merged = { ...merged, ...preset.tokens };
    }
  }

  // 2) Base tokens
  const base = buildBaseTokens(answers);
  merged = {
    ...merged,
    ...Object.fromEntries(Object.entries(base).map(([k, v]) => [k, String(v)])),
  };

  // 3) Env overrides (highest precedence)
  if (ctx.envTokens) merged = { ...merged, ...ctx.envTokens };

  return merged;
}
