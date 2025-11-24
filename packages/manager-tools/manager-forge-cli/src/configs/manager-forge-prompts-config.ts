/**
 * List of supported customer regions.
 * Kept small and stable so prompt order is deterministic.
 */
export const REGIONS = ['CA', 'EU', 'US'] as const;

/** Narrow union of {@link REGIONS}. */
export type Region = (typeof REGIONS)[number];

/**
 * Top-level product universes used for routing, tracking, and UX copy.
 */
export const UNIVERSES = [
  'Dedicated',
  'Manager',
  'Web',
  'Server',
  'Hub',
  'Baremetal',
  'HostedPrivatedCloud',
  'PublicCloud',
  'WebCloud',
  'Telecom',
  'Sunrise',
  'Account-creation',
] as const;

/** Narrow union of {@link UNIVERSES}. */
export type Universe = (typeof UNIVERSES)[number];

/**
 * Sub-universes (second-level classification).
 * Note: list differs slightly from {@link UNIVERSES} (e.g. includes 'Network').
 */
export const SUB_UNIVERSES = [
  'Dedicated',
  'Manager',
  'Web',
  'Server',
  'Hub',
  'Network',
  'HostedPrivatedCloud',
  'PublicCloud',
  'WebCloud',
  'Telecom',
  'Sunrise',
  'Account-creation',
] as const;

/**
 * Canonical list of Level2 tracking codes.
 * Order is intentional to match legacy generator output.
 */
export const LEVEL2_CODES = [
  '0',
  '56',
  '57',
  '67',
  '81',
  '84',
  '85',
  '86',
  '87',
  '88',
  '95',
  '98',
  '120',
  '152',
] as const;

/** Narrow union of {@link LEVEL2_CODES}. */
export type Level2Code = (typeof LEVEL2_CODES)[number];

/**
 * Human-readable labels for known Level2 codes.
 * Add/adjust labels here to affect prompts and summaries globally.
 */
export const LEVEL2_LABELS: Record<Level2Code, string> = {
  '0': 'Unknown',
  '56': 'ManagerCloud',
  '57': 'ManagerDedicated',
  '67': 'Focus',
  '81': 'Manager',
  '84': 'ManagerWeb',
  '85': 'ManagerServer',
  '86': 'ManagerPublicCloud',
  '87': 'ManagerTelecom',
  '88': 'ManagerHub',
  '95': 'Manager-account-creation',
  '98': 'ManagerHostedPrivateCloud',
  '120': 'Manager-Enterprise_solutions',
  '152': 'Manager-Network',
} as const;

/**
 * Inquirer-friendly choices for Level2 selection.
 * - `name`: what is displayed in the prompt (e.g. `"56 - ManagerCloud"`).
 * - `value`: the actual value stored/returned by Inquirer (typed `Level2Code`).
 * - `short`: compact summary used by Inquirer after selection.
 */
export const level2Choices: ReadonlyArray<{
  name: string;
  value: Level2Code;
  short: string;
}> = LEVEL2_CODES.map((code) => ({
  name: LEVEL2_LABELS[code] ? `${code} - ${LEVEL2_LABELS[code]}` : code,
  value: code,
  short: code,
}));
