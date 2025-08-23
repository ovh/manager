import { MethodGroup, VersionSplit } from '../../kernel/types/inquiries-types';
import { TokenMap } from '../../kernel/types/tokens-types';
import { PresetName } from '../../presets/presets-types';
import { ValidAnswers } from './playbook-schema';

export type RouteFlavor = 'pci' | 'generic';
export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type DashboardApi = 'v6' | 'v2';

/**
 * Runtime tokens injected into templates during generation.
 * All values are strings (or stringified enums) to simplify the replacement pipeline.
 */
export interface Tokens {
  /** Application name in kebab-case form. Example: `"my-app"`. */
  appNameKebab: string;

  /** Optional explicit package name override. */
  packageName?: string;

  /** Stringified boolean flag (`'true' | 'false'`) indicating PCI flavor. */
  isPci: string;

  /** Flavor of generated routes (`'pci'`, or `'generic'`). */
  routeFlavor: RouteFlavor;

  /** Fixed base prefix for routes (e.g. `"public-cloud"`). Empty by default. */
  basePrefix: string;

  /** Kebab-cased short slug used in templates (esp. PCI). */
  appSlug: string;

  /** Base API path for the main entry point. Example: `"/services"`. */
  mainApiPath: string;

  /** API flavor used by listing/datagrid operations. */
  listingApi: ListingApi;

  /** API flavor used by dashboard flows. Mirrors selected endpoint family. */
  dashboardApi: DashboardApi;

  /** List of supported regions. */
  regions?: string[];

  /** List of supported universes. */
  universes?: string[];

  /** Tracking */
  trackingLevel2: string;
  trackingUniverse: string;
  trackingSubUniverse: string;

  /** Listing datagrid service key */
  serviceKey: string;

  /** Human-readable description of the app (optional). */
  description?: string;

  /** GitHub repository of the app (optional). */
  repositoryUrl?: string;

  /**
   * Parsed listing endpoint info (Swagger service object).
   * Example: `{ path: "/cloud/project/{projectId}/..." }`.
   */
  listingEndpoint?: string;

  /** Optional dashboard endpoint identifier (Swagger style). */
  dashboardEndpoint?: string;
}

/**
 * The full set of answers collected by the generator prompts.
 * These are the "source of truth" values before any augmentation/derivation.
 */
export interface GeneratorAnswers {
  /** Name of the application. */
  appName: string;

  /** Human-readable description of the app (optional). */
  description?: string;

  /** Primary business universe/domain. Example: `"cloud"`, `"telecom"`. */
  universe: string;

  /** Sub-universe for finer classification (optional). */
  subUniverse: string;

  /** Service key or identifier to inject into templates. */
  serviceKey: string;

  /** Multi-select list of supported regions (optional). */
  regions?: string[];

  /** Multi-select list of supported universes (optional). */
  universes?: string[];

  /** Application flavor/size (internal taxonomy). */
  flavor: string;

  /** API path for the main entry point (base service path). */
  mainApiPath: string;

  /** API path for the listing endpoint. */
  listingEndpointPath: string;

  /** API path for the dashboard endpoint. */
  dashboardEndpointPath: string;

  /** Target UI language. */
  language: 'en' | 'fr' | 'de' | 'es';

  /** Frontend framework used for the app. */
  framework: 'React' | 'Vue' | 'Angular' | 'Svelte';

  /** Secondary level/code classification. */
  level2: '120' | '121' | '122';

  /** Whether to apply a preset configuration. */
  usePreset: boolean;

  /** Contact email of the user triggering generation. */
  userEmail: string;

  /** Absolute or relative output directory for generated files. */
  out: string;

  /** Optional explicit slug (auto-kebab-cased if provided). */
  appSlug?: string;

  /** Explicit PCI flag (if omitted, inferred from `routeFlavor`). */
  isPci?: boolean;

  /** Route flavor (defaults to `"pci"` if `isPci`, otherwise `"generic"`). */
  routeFlavor?: RouteFlavor;

  /** Base prefix for routes (default: runtime auto-detect). */
  basePrefix?: string;

  /** Listing API family (default: `"v6Iceberg"`). */
  listingApi?: ListingApi;

  /** Dashboard API family (default: `"v6"`). */
  dashboardApi?: DashboardApi;

  /** Optional explicit package name override. */
  packageName?: string;

  /** Raw checkbox selection of API paths. */
  apiPaths?: string[];

  /**
   * Parsed listing endpoint info (Swagger service object).
   * Example: `{ path: "/cloud/project/{projectId}/..." }`.
   */
  listingEndpoint?: string;

  /** Optional dashboard endpoint identifier (Swagger style). */
  dashboardEndpoint?: string;
}

/**
 * Answers augmented at runtime by the prompt flow.
 * These include parity fields, computed flags, derived endpoint metadata,
 * and resolved package name hints.
 */
export type AugmentedAnswers = GeneratorAnswers & {
  /** List of template set(s) chosen or resolved. */
  templates?: string[];

  /** Split of API paths grouped by version (v2/v6). */
  apiPathsByApiVersion?: VersionSplit;

  /** Raw endpoint groups (Swagger) fetched for v6. */
  apiV6Endpoints?: MethodGroup;

  /** Raw endpoint groups (Swagger) fetched for v2. */
  apiV2Endpoints?: MethodGroup;

  /** Normalized PCI flag (sometimes capitalized). */
  isPCI?: boolean;

  /** PCI display name (if applicable). */
  pciName?: string;

  /** True if chosen endpoints belong to v6 API. */
  isApiV6?: boolean;

  /** True if chosen endpoints belong to v2 API. */
  isApiV2?: boolean;

  /** Function name derived from selected listing endpoint. */
  listingEndpointFn?: string;

  /** API version of `mainApiPath` (`'v2'` or `'v6'`). */
  mainApiPathApiVersion?: 'v2' | 'v6';

  /** PCI-specific variant of the `mainApiPath` (if any). */
  mainApiPathPci?: string;

  /** Function name derived from selected dashboard endpoint. */
  dashboardEndpointFn?: string;

  /** Computed/final v6 endpoints used for file generation. */
  apiV6Computed?: MethodGroup;

  /** Computed/final v2 endpoints used for file generation. */
  apiV2Computed?: MethodGroup;
};

export type ResolveCtx = {
  presets?: PresetName[];
  envTokens?: TokenMap; // highest precedence string-only tokens
  defaultAnswers?: Partial<ValidAnswers>; // if you want to merge defaults before building
};
