import { MethodGroup, VersionSplit } from '../../kernel/types/inquiries-types';

/**
 * The full set of answers collected by the generator.
 */
export interface GeneratorAnswers {
  /** Name of the application. */
  appName: string;
  /** Application description. */
  description?: string;
  /** Primary universe (domain) of the application. */
  universe: string;
  /** Sub-universe (if applicable). */
  subUniverse: string;
  /** Application type. */
  appType: 'pci' | 'full' | 'zimbra' | 'iceberg' | 'v2' | 'v6';
  /** Service key or identifier used in templates. */
  serviceKey: string;
  /** Multi-select: chosen regions (optional). */
  regions?: string[];
  /** Multi-select: chosen universes (optional). */
  universes?: string[];
  /** Single-select: default region. */
  region: string;
  /** Application flavor/size. */
  flavor: string;
  /** API path for the main entry point. */
  mainApiPath: string;
  /** API path for the listing endpoint. */
  listingEndpointPath: string;
  /** API path for the dashboard endpoint. */
  dashboardEndpointPath: string;
  /** Language code. */
  language: 'en' | 'fr' | 'de' | 'es';
  /** Framework to use for the app. */
  framework: 'React' | 'Vue' | 'Angular' | 'Svelte';
  /** Secondary level or code classification. */
  level2: '120' | '121' | '122';
  /** Whether to use a preset configuration. */
  usePreset: boolean;
  /** Email address of the user. */
  userEmail: string;
  /** Output directory for generated files. */
  out: string;

  packageName?: string;
  apiPaths?: string[]; // checkbox selection
  listingEndpoint?: string; // e.g. "/cloud/project-GET..."
  dashboardEndpoint?: string; // e.g. "/cloud/project-GET..."
}

/**
 * Answers augmented at runtime by the prompt flow (parity fields).
 * These are attached during `when` handlers and derivations.
 */
export type AugmentedAnswers = GeneratorAnswers & {
  // flow metadata
  templates?: string[];
  apiPathsByApiVersion?: VersionSplit;

  // raw endpoints fetched for V2/V6
  apiV6Endpoints?: MethodGroup;
  apiV2Endpoints?: MethodGroup;

  // flags computed from selections
  isPCI?: boolean;
  pciName?: string;
  isApiV6?: boolean;
  isApiV2?: boolean;

  // selections/paths derived from chosen endpoints
  listingEndpointPath?: string;
  listingEndpointFn?: string;
  mainApiPath?: string;
  mainApiPathApiVersion?: 'v2' | 'v6';
  mainApiPathPci?: string;
  dashboardEndpointPath?: string;
  dashboardEndpointFn?: string;

  // filtered groups used by file generation
  apiV6Computed?: MethodGroup;
  apiV2Computed?: MethodGroup;

  // resolved once from appName/packageName for templates (e.g., package.json)
  packageNameResolved?: string;
};
