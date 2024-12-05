/** AI Solutions Data Object */
export interface Framework {
  /** Short description of the framework */
  description?: string;
  /** URL toward the framework documentation */
  docUrl?: string;
  /** Unique identifier of the framework */
  id?: string;
  /** URL toward the logo to illustrate the framework */
  logoUrl?: string;
  /** Name of the framework */
  name?: string;
  /** Available versions for the framework (default is the first one) */
  versions?: string[];
}
