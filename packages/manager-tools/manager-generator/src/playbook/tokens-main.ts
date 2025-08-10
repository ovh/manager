/**
 * @file tokens-main.ts
 * @description High-level token resolution: validate answers, merge presets,
 * build base tokens, merge env, coerce, and validate final TokenMap.
 */
import { deepMerge, lower, trim } from '../kernel/tokens/tokens-helper';
import { type TokenMap } from '../kernel/types/tokens-types';
import { loadPreset } from '../presets/presets';
import { type Preset, type ResolveContext } from '../presets/presets-types';
import { heroImage } from './config/playbook-constants';
import { AnswersSchema, TokenMapSchema, type ValidAnswers } from './types/playbook-schema';

/**
 * Build base tokens from normalized answers.
 * Mirrors legacy generator defaults/aliases while keeping modern field names.
 */
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

  const isPci = answers.appType === 'pci';
  const routeFlavor = isPci ? 'pci' : 'generic';

  // Keep old generator’s API label hints
  const listingApi = 'v6Iceberg';
  const onboardingApi = 'v2';

  // Tracking defaults kept for legacy parity
  const level2EU = '120';
  const level2CA = '120';
  const level2US = '120';

  const inferredSubUniverse =
    answers.subUniverse && answers.subUniverse !== 'none'
      ? answers.subUniverse
      : isPci
        ? 'Compute'
        : 'none';

  const serviceKey =
    (answers.listingEndpointPath ?? '')
      .replace(/^\//, '') // drop leading slash
      .replace(/\/+/g, '-') || // normalize to kebab-ish
    `${appNameKebab}-listing`; // fallback if no listing endpoint

  return {
    // UPPER_SNAKE (legacy)
    APP_NAME: answers.appName,
    APP_TYPE: answers.appType ?? 'full',
    UNIVERSE: answers.universe,
    SUB_UNIVERSE: inferredSubUniverse,
    REGION: answers.region ?? 'EU',
    FLAVOR: answers.flavor ?? 'generic',
    USE_PRESET: String(answers.usePreset ?? false),
    USER_EMAIL: answers.userEmail ?? '',
    LANGUAGE: answers.language ?? 'en',
    FRAMEWORK: answers.framework ?? 'React',
    MAIN_API_PATH: answers.mainApiPath ?? '',
    LISTING_ENDPOINT: answers.listingEndpointPath ?? '',
    DASHBOARD_ENDPOINT: answers.dashboardEndpointPath ?? '',

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

    // APIs
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
 * 1) Validate & normalize raw answers
 * 2) Load requested presets
 * 3) Merge defaults → presets.defaults → user
 * 4) Build base tokens and merge with presets.tokens and envTokens
 * 5) Coerce known booleans (as strings)
 * 6) Validate final TokenMap with zod
 */
// eslint-disable-next-line complexity,max-lines-per-function
export async function resolveTokens(
  rawAnswers: unknown,
  ctx: ResolveContext = {},
): Promise<TokenMap> {
  // 1) validate & normalize answers (schema allows optional fields)
  const parsed = AnswersSchema.parse(rawAnswers);

  // Accept legacy key casing (old generator used "subuniverse")
  const legacySub = (parsed as unknown as { subuniverse?: string }).subuniverse;
  const subUniverseRaw = parsed.subUniverse ?? legacySub;

  // Derivations that the old generator implied
  const isPci = (parsed.appName ?? '').toLowerCase().includes('pci');
  const derivedAppType = parsed.appType ?? (isPci ? 'pci' : 'full');

  // Legacy checkbox output sometimes provided `regions: string[]`
  const rawRegions = (rawAnswers as Record<string, string[]>)?.regions || [];
  const derivedRegion =
    parsed.region ??
    (Array.isArray(rawRegions) && rawRegions.length ? rawRegions[0] : undefined) ??
    'EU';

  const derivedFlavor = parsed.flavor ?? 'generic';

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

  // 2) load presets
  const appliedPresets: Preset[] = [];
  for (const name of ctx.presets ?? []) {
    const p = await loadPreset(name);
    if (p) appliedPresets.push(p);
  }

  // 3) merge answers (defaults → presets.defaults → user)
  const answersMerged = [
    ctx.defaultAnswers ?? {},
    ...appliedPresets.map((p) => p.defaults ?? {}),
    normalized,
  ].reduce(
    (acc, part) => deepMerge(acc, part as Record<string, unknown>),
    {} as Record<string, unknown>,
  ) as ValidAnswers;

  // 4) tokens (base → presets.tokens → env)
  const baseTokens = buildBaseTokens(answersMerged);
  const mergedTokens = [
    baseTokens,
    ...appliedPresets.map((p) => p.tokens ?? {}),
    ctx.envTokens ?? {},
  ].reduce<TokenMap>((acc, part) => ({ ...acc, ...part }), {});

  // 5) defensive coercions (strings, since TokenMap is stringly-typed)
  const asBoolString = (v: unknown): string => {
    if (typeof v === 'string') {
      return (v.trim().toLowerCase() === 'true').toString();
    }
    return Boolean(v).toString();
  };

  const withCoercedBooleans: TokenMap = {
    ...mergedTokens,
    isPci: asBoolString(mergedTokens.isPci),
    USE_PRESET: asBoolString(mergedTokens.USE_PRESET),
  };

  // 6) final validation
  return TokenMapSchema.parse(withCoercedBooleans);
}
