/** AI Solutions Job image object */
export interface Image {
  /** Short description of the image */
  description?: string;
  /** URL of the image documentation */
  docUrl?: string;
  /** Unique identifier of the image */
  id?: string;
  /** URL of the logo of the image */
  logoUrl?: string;
  /** Name of the image */
  name?: string;
  /** List of available versions of this image */
  versions?: string[];
}
