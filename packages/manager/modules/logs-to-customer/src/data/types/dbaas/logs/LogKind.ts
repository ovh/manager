/** Log kind */
export interface LogKind {
  /** List of additional log fields managed in this log kind */
  additionalReturnedFields?: string[];
  /** Creation date of the log kind */
  createdAt?: string;
  /** Log kind display name */
  displayName: string;
  /** Log kind ID */
  kindId: string;
  /** Log kind name */
  name: string;
  /** Last update date of the log kind */
  updatedAt?: string;
}
