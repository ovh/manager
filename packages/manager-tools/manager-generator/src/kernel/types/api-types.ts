/**
 * @file types.ts
 * @description Shared API-related TypeScript types and interfaces used across the generator.
 */
import { UNIVERSES } from '../../playbook/config/api-config';

/**
 * Enumeration of valid "universes" supported by the generator,
 * derived directly from the central {@link UNIVERSES} constant.
 *
 * Examples of universes: "dedicated", "public-cloud", "telecom".
 */
export type Universe = (typeof UNIVERSES)[number];

/**
 * Parameter shape coming from the operation source (Swagger/OpenAPI).
 *
 * These are individual parameters expected for an API operation.
 * Not all fields are guaranteed to be present.
 */
export interface OperationParameter {
  /** Name of the parameter (e.g., "serviceName", "id"). */
  name?: string;

  /** Full type of the parameter (e.g., "string", "long", "cloud.project.Project"). */
  fullType?: string;

  /** Whether the parameter is required for the operation. */
  required?: boolean;

  /** Optional description provided by the API schema. */
  description?: string;
}

/**
 * Operation shape coming from the operation source (Swagger/OpenAPI).
 *
 * This represents a single API operation, typically tied to an HTTP method.
 */
export interface Operation {
  /** HTTP method (e.g., "GET", "POST", "DELETE"). */
  httpMethod: string;

  /** List of parameters this operation expects. */
  parameters: OperationParameter[];

  /** Response type string (e.g., "string", "foo.bar.Type[]"). */
  responseType: string;

  /** Optional description provided by the API schema. */
  description?: string;

  /**
   * Optional fields present in some Swagger sources:
   * - `path`: relative operation path
   * - `functionName`: suggested SDK function name
   * - `operationId`: unique operation identifier
   */
  path?: string;
  functionName?: string;
  operationId?: string;

  /** Allow arbitrary extra fields from upstream API definitions. */
  [key: string]: unknown;
}

/**
 * Choice rows returned by {@link getApiPaths}.
 *
 * These represent options presented to the user during API selection.
 * They may be:
 *  - `{ name, value }` entries (selectable endpoints),
 *  - `{ type: 'separator', line?: string }` entries (non-selectable headers),
 *  - plain strings (treated as `{ name: string, value: string }`).
 */
export type ApiPathChoice = { name: string; value: string } | { type: 'separator'; line?: string };

/**
 * Minimal shape of a Swagger operation used by the generator.
 *
 * This is a reduced subset of the full OpenAPI spec,
 * containing only the fields we actually consume.
 */
export interface ApiOperation {
  /** HTTP method (e.g., "GET", "POST"). */
  method: string;

  /** Alternative method name (legacy sources). */
  type?: string;

  /** Suggested identifier (if provided by Swagger). */
  nickname?: string;

  /** Human-readable summary. */
  summary?: string;

  /** Additional notes or documentation. */
  notes?: string;
}

/**
 * Legacy/expected shape used by downstream code.
 *
 * Each entry represents a "service" (API group) with a base path
 * and its list of operations.
 */
export interface ServiceOperations {
  /** Base path of the service (e.g., "/iam", "/cloud/project"). */
  path: string;

  /** Optional description of the service. */
  description?: string;

  /** List of operations supported by this service. */
  operations?: ApiOperation[];
}

/**
 * Inputs to the API selection policy.
 *
 * These booleans and hints are derived from user choices and
 * Swagger inspection before deciding which API flavor to use.
 */
export interface ApiSelectionInputs {
  /** True if any v6 GET operations exist for the chosen services. */
  hasV6: boolean;

  /** True if any v2 GET operations exist for the chosen services. */
  hasV2: boolean;

  /**
   * Indicates which API version the selected listing endpoint belongs to.
   * If unknown, fallback to 'v6' for backward compatibility.
   */
  listingBelongsTo?: 'v2' | 'v6';
}

/**
 * Outputs from the API selection policy.
 *
 * This represents the resolved API flavors that should be used
 * for different generator layers (listing vs dashboard).
 */
export interface ApiSelectionResult {
  /**
   * API flavor used by the listing/datagrid layer.
   * - Prefer 'v6Iceberg' whenever v6 exists.
   * - Use 'v2' if only v2 exists.
   * - Fallback to 'v6Iceberg' if neither is present.
   */
  listingApi: 'v6Iceberg' | 'v2' | 'v6';

  /**
   * API flavor used by dashboard flows (form actions, create/delete).
   * Mirrors the version where the selected listing endpoint belongs.
   */
  dashboardApi: 'v2' | 'v6';
}

/**
 * Subset of a Swagger service document we care about.
 *
 * This is the shape returned by the root service Swagger JSON,
 * containing only the `apis` array with their operations.
 */
export interface SwaggerServiceDoc {
  apis?: ServiceOperations[];
}
