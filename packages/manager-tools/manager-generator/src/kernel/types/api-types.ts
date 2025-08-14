/**
 * @file types.ts
 * @description Shared API-related TypeScript types and interfaces.
 */
import { UNIVERSES } from '../../playbook/config/api-static-data';

/** Single catalog entry (e.g., a product, template, or service). */
export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  code?: string;
}

/** A region or endpoint descriptor. */
export interface Endpoint {
  code: string;
  name: string;
  url: string;
}

/** User profile information. */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  accountId?: string;
}

/** Options for fetching the catalog. */
export interface FetchCatalogOptions {
  /** Base API URL. */
  baseUrl: string;
  /** Request timeout in ms (default: 5000). */
  timeout?: number;
}

/** Options for fetching endpoints. */
export interface FetchEndpointsOptions {
  /** Base API URL. */
  baseUrl: string;
  /** Service identifier (e.g., "pci"). */
  serviceId: string;
  /** Request timeout in ms (default: 5000). */
  timeout?: number;
}

/** Options for fetching user info. */
export interface FetchUserInfoOptions {
  /** Base API URL. */
  baseUrl: string;
  /** Request timeout in ms (default: 5000). */
  timeout?: number;
  /** Auth token or API key. */
  token?: string;
}

export type Universe = (typeof UNIVERSES)[number];

/** Parameter shape coming from the operation source. */
export interface OperationParameter {
  name?: string;
  fullType?: string;
  required?: boolean;
  description?: string;
}

/** Operation shape coming from the operation source. */
export interface Operation {
  httpMethod: string; // e.g., "GET", "POST"
  parameters: OperationParameter[];
  responseType: string; // e.g., "string", "foo.bar.Type[]"
  description?: string;
  // Optional fields present in some sources
  path?: string;
  functionName?: string;
  operationId?: string;
  [key: string]: unknown;
}

/**
 * Choice rows coming from getApiPaths(). We support:
 *  - { name, value } entries (selectable),
 *  - { type: 'separator', line?: string } (non-selectable headers),
 *  - strings (treated as both name & value).
 */
export type ApiPathChoice = { name: string; value: string } | { type: 'separator'; line?: string };

/**
 * Minimal shape of a Swagger operation.
 * Only the fields we actually use in the generator are included.
 */
export interface ApiOperation {
  method: string;
  type?: string;
  nickname?: string;
  summary?: string;
  notes?: string;
}

/**
 * Legacy/expected shape by downstream code:
 * an array of "service" entries having a path and a list of operations.
 */
export interface ServiceOperations {
  path: string;
  description?: string;
  operations?: ApiOperation[];
}

/** Template param (normalized for TS). */
export interface TemplateParam {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

/** A single normalized operation in the template data. */
export interface TemplateOperation {
  functionName: string;
  apiVersion: 'v2' | 'v6';
  apiPath: string;
  description?: string;
  httpMethod: string; // lowercased: 'get' | 'post' | ...
  responseType: string; // cleaned TS type
  params: TemplateParam[];
  unknownTypeList: Set<string>;
  // computed by setUrlAndBodyParams
  url: string;
  urlParams: TemplateParam[];
  bodyParams: TemplateParam[];
}

/** Grouped-by-method template shape. */
export type ApiTemplateData = {
  [method: string]: {
    operationList: TemplateOperation[];
    unknownTypeList: Set<string>;
  };
};
