/**
 * Type representing an application entry.
 */
export interface Application {
  name: string; // e.g. "zimbra"
  value: string; // full package name e.g. "@ovh-ux/manager-zimbra"
  regions?: string[];
}

/**
 * Workspace info structure returned by `yarn workspaces info`.
 */
export interface YarnWorkspaceInfo {
  location: string;
  workspaceDependencies: string[];
}

/**
 * App Package JSON type
 */
export interface AppPackageJson {
  name: string;
  regions?: string[];
}
