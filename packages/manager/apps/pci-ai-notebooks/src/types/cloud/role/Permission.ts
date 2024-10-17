/** Role permissions */
export interface Permission {
  /** Permission label */
  label?: string;
  /** Roles having this permission */
  roles?: string[];
}
