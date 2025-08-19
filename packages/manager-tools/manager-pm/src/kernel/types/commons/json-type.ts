/**
 * Shape of the root package.json we care about.
 */
export interface JsonType {
  workspaces?: {
    packages?: string[];
  };
  [key: string]: unknown;
}
