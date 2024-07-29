/** AI Solutions Notebook editor object */
export interface Editor {
  /** Short description of the editor */
  description?: string;
  /** URL of the editor documentation */
  docUrl?: string;
  /** Unique identifier of the editor */
  id?: string;
  /** URL of the logo of the editor */
  logoUrl?: string;
  /** Name of the editor */
  name?: string;
  /** List of available versions of this editor */
  versions?: string[];
}
