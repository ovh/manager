/**
 * Shape of the root package.json we care about.
 */
export interface PackageJsonType {
  workspaces?: {
    packages?: string[];
  };
  name?: string;
  version?: string;
  private?: boolean;
  dependencies?: Record<string, string>;
  [key: string]: unknown;
}
