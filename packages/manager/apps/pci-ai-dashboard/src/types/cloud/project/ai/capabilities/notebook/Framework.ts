/** AI Solutions Notebook framework object */
export interface Framework {
  /** Short description of the framework */
  description?: string;
  /** URL of the framework documentation */
  docUrl?: string;
  /** Unique identifier of the framework */
  id?: string;
  /** URL of the logo of the framework */
  logoUrl?: string;
  /** Name of the framework */
  name?: string;
  /** List of paths that are automatically saved */
  savedPaths?: string[];
  /** List of available versions of this framework */
  versions?: string[];
}
