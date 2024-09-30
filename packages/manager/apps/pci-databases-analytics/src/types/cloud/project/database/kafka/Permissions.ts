/** Cloud databases kafka permissions definition */
export interface Permissions {
  /** Names of the topic permissions (DEPRECATED) */
  names?: string[];
  /** Names of the schema registry permissions */
  schemaRegistry?: string[];
  /** Names of the topic permissions */
  topic?: string[];
}
