/**
 * Type representing an application entry, used for selection or metadata.
 */
export interface Application {
  /** Short name of the app (e.g., `"zimbra"`). */
  name: string;

  /** Full package name (e.g., `"@ovh-ux/manager-zimbra"`). */
  value: string;

  /** Optional list of supported regions (e.g., `["EU", "US"]`). */
  regions?: string[];
}

/**
 * Workspace info structure returned by `yarn workspaces info`.
 */
export interface YarnWorkspaceInfo {
  /** Relative location of the workspace directory (e.g., `"packages/manager/apps/web"`). */
  location: string;

  /** List of dependent workspaces (by package name). */
  workspaceDependencies: string[];
}

/**
 * Minimal `package.json` type for manager apps.
 */
export interface AppPackageJson {
  /** NPM package name (e.g., `"@ovh-ux/manager-web"`). */
  name: string;

  /** Optional list of supported regions defined at package level. */
  regions?: string[];
}

/** String reference to an app (name, package name, path, etc.). */
export type AppRef = string;

/** Workspace-relative POSIX path (e.g., `"packages/manager/apps/web"`). */
export type WorkspacePath = string;

/** Absolute filesystem path. */
export type AbsolutePath = string;

/** Valid NPM package name. */
export type PackageName = string;

/** Path to a catalog JSON file. */
export type CatalogFile = string;

/** List of workspace-relative app paths. */
export type CatalogList = string[];

/** Paths to PNPM and Yarn catalog files. */
export type CatalogPaths = {
  /** Path to PNPM catalog JSON file. */
  pnpmCatalogPath: string;

  /** Path to Yarn catalog JSON file. */
  yarnCatalogPath: string;
};
