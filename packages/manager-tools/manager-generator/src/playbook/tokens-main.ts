/**
 * @file tokens-main.ts
 * @description Validate answers, merge presets/env, derive API knobs, coerce, and validate TokenMap.
 */
import {
  asDict,
  deepMerge,
  extractApiPaths,
  lower,
  readString,
  readStringArray,
  sanitizePathForSchema,
  splitCombinedEndpoint,
  trim,
} from '../kernel/tokens/tokens-helper';
import { type TokenMap } from '../kernel/types/tokens-types';
import { loadPreset } from '../presets/presets';
import { type Preset, type ResolveContext } from '../presets/presets-types';
import { heroImage } from './config/playbook-constants';
import { AnswersSchema, TokenMapSchema, type ValidAnswers } from './types/playbook-schema';

/** Build base tokens from normalized answers. */
// eslint-disable-next-line max-lines-per-function
export function buildBaseTokens(answers: ValidAnswers): TokenMap {
  const kebab = (s: string) =>
    s
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();

  const appNameKebab = kebab(answers.appName);
  const defaultDescription = `${answers.appName} — OVHcloud Manager Application`;
  const npmName = `@ovh-ux/manager-${appNameKebab}-app`;
  const repositoryDir = `packages/apps/${appNameKebab}`;

  // Old-generator compatible: case-sensitive substring "pci"
  const isPci = answers.appName.indexOf('pci') > -1;
  const routeFlavor = isPci ? 'pci' : 'generic';

  // API defaults (overlaid later by derived values)
  const listingApi = 'v6Iceberg';
  const onboardingApi = 'v2';

  // Tracking defaults (legacy parity)
  const level2EU = '120';
  const level2CA = '120';
  const level2US = '120';

  const inferredSubUniverse =
    answers.subUniverse && answers.subUniverse !== 'none'
      ? answers.subUniverse
      : isPci
        ? 'Compute'
        : 'none';

  // Sanitize listing/dashboard for constants:
  // - split combined "-fn" suffix
  // - remove `{param}` braces (schema-safe), ensure leading slash
  const listingEndpointForConstants = sanitizePathForSchema(
    splitCombinedEndpoint(answers.listingEndpointPath ?? ''),
  ).replace(/\{([^}]+)\}/g, '$1');

  const dashboardEndpointForConstants = sanitizePathForSchema(
    splitCombinedEndpoint(answers.dashboardEndpointPath ?? ''),
  ).replace(/\{([^}]+)\}/g, '$1');

  // Derive a stable serviceKey from the listing path (brace-aware)
  const listingPathForKey = splitCombinedEndpoint(answers.listingEndpointPath ?? '');
  const serviceKey =
    listingPathForKey
      .replace(/\{[^}]*\}/g, '') // drop {param}
      .replace(/-+[a-z][a-zA-Z0-9]*$/, '') // drop "-getX"/"-listX"
      .replace(/^\//, '') // remove leading slash
      .replace(/\/+/g, '-') // slashes → dashes
      .replace(/--+/g, '-') // collapse doubles
      .replace(/^-|-$/g, '') || // trim edges
    `${appNameKebab}-listing`;

  return {
    // UPPER_SNAKE (legacy)
    APP_NAME: answers.appName,
    APP_TYPE: 'full',
    UNIVERSE: answers.universe,
    SUB_UNIVERSE: inferredSubUniverse,
    REGION: answers.region ?? 'EU',
    FLAVOR: answers.flavor ?? 'generic',
    USE_PRESET: String(answers.usePreset ?? false),
    USER_EMAIL: answers.userEmail ?? '',
    LANGUAGE: answers.language ?? 'en',
    FRAMEWORK: answers.framework ?? 'React',
    MAIN_API_PATH: answers.mainApiPath ?? '',
    // For constants files we want schema-safe (no braces) and no "-fn" suffix
    LISTING_ENDPOINT: listingEndpointForConstants,
    DASHBOARD_ENDPOINT: dashboardEndpointForConstants,

    // Service key used by listing datagrid
    serviceKey,

    // aliases / metadata
    appNameKebab,
    description: answers.description ?? defaultDescription,
    npmName,
    repositoryDir,
    repositoryUrl: repositoryDir,

    // camelCase for flavor-aware templates
    appName: answers.appName,

    // flavor & routing
    isPci: String(isPci),
    routeFlavor,
    basePrefix: '',
    serviceParam: 'serviceId',
    platformParam: 'platformId',
    appSlug: appNameKebab,

    // APIs (defaults; overlaid later)
    listingApi,
    onboardingApi,

    // tracking
    level2EU,
    level2CA,
    level2US,
    universe: answers.universe,
    subUniverse: inferredSubUniverse,

    // onboarding content defaults
    productName: answers.appName.replace(/(^|[-_ ])\w/g, (m) => m.toUpperCase()),
    productCategory: 'Public Cloud',
    brand: 'OVHcloud',
    linkDiscover: '#',
    linkTutorial: '#',
    linkFaq: '#',
    heroImage,
  };
}

/**
 * Resolve a full TokenMap (answers + presets + env) and validate it.
 *
 * Steps:
 * 1) Merge env-injected JSON into answers (tests use MGR_GEN_INJECT_JSON)
 * 2) Parse & normalize via Zod (schema handles path quirks)
 * 3) Old-gen derivations (PCI, API flavors)
 * 4) Load presets
 * 5) Merge defaults → presets.defaults → user
 * 6) Build base tokens and merge with presets.tokens and envTokens
 * 7) Overlay derived API/PCI tokens
 * 8) Coerce known booleans (as strings)
 * 9) Validate final TokenMap with zod
 */
// eslint-disable-next-line complexity,max-lines-per-function
export async function resolveTokens(
  rawAnswers: unknown,
  ctx: ResolveContext = {},
): Promise<TokenMap> {
  /* ---------------------------------------------------------------------- */
  /* 1) Merge optional injected JSON (for tests/automation)                  */
  /* ---------------------------------------------------------------------- */
  let rawDict: Record<string, unknown> = asDict(rawAnswers) ? { ...rawAnswers } : {};
  const injectedStr = typeof process !== 'undefined' ? process.env.MGR_GEN_INJECT_JSON : undefined;
  if (injectedStr) {
    try {
      const injected = JSON.parse(injectedStr) as Record<string, unknown>;
      if (asDict(injected)) {
        rawDict = deepMerge(rawDict, injected);
      }
    } catch {
      // ignore malformed env JSON
    }
  }

  /* ---------------------------------------------------------------------- */
  /* 2) Parse & normalize via Zod (schema does path normalization)           */
  /* ---------------------------------------------------------------------- */
  const parsed = AnswersSchema.parse(rawDict);

  // Accept legacy key casing (old generator used "subuniverse")
  const legacySub = (parsed as unknown as { subuniverse?: string }).subuniverse;
  const subUniverseRaw = parsed.subUniverse ?? legacySub;

  // Legacy checkbox output sometimes provided `regions: string[]`
  const regionsFromRaw = readStringArray(rawDict, 'regions');
  const derivedRegion =
    parsed.region ??
    (regionsFromRaw && regionsFromRaw.length ? regionsFromRaw[0] : undefined) ??
    'EU';

  const derivedFlavor = parsed.flavor ?? 'generic';

  // Old-generator compatible PCI detection & appType (name-based)
  const nameRaw = (parsed.appName ?? '').trim();
  const isPci = nameRaw.indexOf('pci') > -1;
  const derivedAppType = isPci ? 'pci' : 'full';
  const pciName = isPci ? nameRaw.split('pci-')[1] : undefined;

  const normalized: ValidAnswers = {
    ...parsed,
    appName: trim(parsed.appName)!,
    universe: trim(parsed.universe)!,
    subUniverse: trim(subUniverseRaw) ?? 'none',
    appType: derivedAppType,
    region: trim(derivedRegion),
    flavor: trim(derivedFlavor),
    userEmail: trim(parsed.userEmail),
    language: parsed.language ? lower(trim(parsed.language)) : (parsed.language ?? 'en'),
    framework: parsed.framework ? trim(parsed.framework) : (parsed.framework ?? 'React'),
    mainApiPath: trim(parsed.mainApiPath) || '',
    listingEndpointPath: trim(parsed.listingEndpointPath) || '',
    dashboardEndpointPath: trim(parsed.dashboardEndpointPath) || '',
  };

  /* ---------------------------------------------------------------------- */
  /* 3) API version derivation (brace-aware listing path)                    */
  /* ---------------------------------------------------------------------- */
  // Prefer original (possibly combined) listing value to detect membership
  const originalListingValue =
    readString(rawDict, 'listingEndpoint') ??
    readString(rawDict, 'listingEndpointPath') ??
    parsed.listingEndpointPath;

  const listingPathWithBraces =
    typeof originalListingValue === 'string' ? splitCombinedEndpoint(originalListingValue) : '';

  const apiV2Ops = extractApiPaths(rawDict, 'apiV2Endpoints');
  const apiV6Ops = extractApiPaths(rawDict, 'apiV6Endpoints');

  // v2 if listing path is found in v2 GET operations; else v6
  const mainApiPathApiVersion: 'v2' | 'v6' = apiV2Ops.includes(listingPathWithBraces) ? 'v2' : 'v6';

  const isApiV2 = apiV2Ops.length > 0;
  const isApiV6 = apiV6Ops.length > 0;

  // Prefer v6Iceberg when any v6 GET exists; else v2 if only v2 exists; else default v6Iceberg
  const derivedListingApi: 'v6Iceberg' | 'v2' | 'v6' = isApiV6
    ? 'v6Iceberg'
    : isApiV2
      ? 'v2'
      : 'v6Iceberg';

  // Onboarding API follows detected version from listing path membership
  const derivedOnboardingApi: 'v2' | 'v6' = mainApiPathApiVersion;

  /* ---------------------------------------------------------------------- */
  /* 4) Load presets                                                         */
  /* ---------------------------------------------------------------------- */
  const appliedPresets: Preset[] = [];
  for (const name of ctx.presets ?? []) {
    const p = await loadPreset(name);
    if (p) appliedPresets.push(p);
  }

  /* ---------------------------------------------------------------------- */
  /* 5) Merge answers (defaults → presets.defaults → user)                   */
  /* ---------------------------------------------------------------------- */
  const answersMerged = [
    ctx.defaultAnswers ?? {},
    ...appliedPresets.map((p) => p.defaults ?? {}),
    normalized,
  ].reduce(
    (acc, part) => deepMerge(acc, part as Record<string, unknown>),
    {} as Record<string, unknown>,
  ) as ValidAnswers;

  /* ---------------------------------------------------------------------- */
  /* 6) Tokens (base → presets.tokens → env + overlays)                      */
  /* ---------------------------------------------------------------------- */
  const baseTokens = buildBaseTokens(answersMerged);

  const mergedTokens = [
    baseTokens,
    ...appliedPresets.map((p) => p.tokens ?? {}),
    ctx.envTokens ?? {},
    {
      listingApi: derivedListingApi,
      onboardingApi: derivedOnboardingApi,
      isPci: isPci.toString(),
      routeFlavor: isPci ? 'pci' : 'generic',
      isApiV2: isApiV2.toString(),
      isApiV6: isApiV6.toString(),
      mainApiPathApiVersion,
      APP_TYPE: isPci ? 'pci' : 'full',
      pciName: pciName ?? '',
    },
  ].reduce<TokenMap>((acc, part) => ({ ...acc, ...part }), {});

  /* ---------------------------------------------------------------------- */
  /* 7) Coerce booleans as strings where expected                            */
  /* ---------------------------------------------------------------------- */
  const asBoolString = (v: unknown): string => {
    if (typeof v === 'string') return (v.trim().toLowerCase() === 'true').toString();
    return Boolean(v).toString();
  };

  const withCoercedBooleans: TokenMap = {
    ...mergedTokens,
    isPci: asBoolString(mergedTokens.isPci),
    USE_PRESET: asBoolString(mergedTokens.USE_PRESET),
  };

  /* ---------------------------------------------------------------------- */
  /* 8) Final validation                                                     */
  /* ---------------------------------------------------------------------- */
  return TokenMapSchema.parse(withCoercedBooleans);
}
