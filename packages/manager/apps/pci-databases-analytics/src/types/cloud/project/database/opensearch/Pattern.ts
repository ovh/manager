/** Cloud database opensearch pattern definition */
export interface Pattern {
  /** Pattern ID */
  id?: string;
  /** Maximum number of index for this pattern */
  maxIndexCount: number;
  /** Pattern format */
  pattern: string;
}
