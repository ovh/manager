/** Defines the database object in a cluster */
export interface Database {
  /** Defines if the database has been created by default */
  default?: boolean;
  /** Database ID */
  id?: string;
  /** Database name */
  name: string;
}
