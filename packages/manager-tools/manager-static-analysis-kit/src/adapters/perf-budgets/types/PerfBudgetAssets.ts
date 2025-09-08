/**
 * Represents a single parsed asset from the bundle analyzer output.
 */
export interface ParsedAsset {
  /** Full filename or path of the asset */
  filename: string;
  /** Asset type, inferred from extension */
  type: 'js' | 'css' | 'html' | 'img' | 'other';
  /** Size in kilobytes (KB), based on `parsedSize` */
  sizeKb: number;
}

/**
 * Represents aggregated bundle size information with per-asset details.
 */
export interface ParsedBundle {
  /** Total JavaScript size in KB */
  jsKb: number;
  /** Total CSS size in KB */
  cssKb: number;
  /** Total HTML size in KB */
  htmlKb: number;
  /** Total image size in KB */
  imgKb: number;
  /** List of parsed individual assets */
  assets: ParsedAsset[];
}
