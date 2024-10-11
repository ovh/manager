/** Representation of a registry */
export interface Registry {
  /** Registry creation date */
  createdAt?: string;
  /** Registry Id */
  id?: string;
  /** Docker registry password */
  password: string;
  /** Region where the registry is available */
  region: string;
  /** Registry update date */
  updatedAt?: string;
  /** Docker registry URL */
  url: string;
  /** Registry user creator */
  user?: string;
  /** Docker registry username */
  username: string;
}
