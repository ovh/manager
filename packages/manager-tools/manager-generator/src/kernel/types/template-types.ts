import { TokenMap } from './tokens-types';

export interface ApplyTemplatesOptions {
  /** Absolute path to the template folder to copy from */
  templateDir: string;
  /** Absolute path to the target folder to write into */
  targetDir: string;
  /** Tokens used to replace {{TOKEN}} placeholders (string-only contract) */
  tokens: TokenMap;
  /** If true, prints actions but does not write files */
  dryRun?: boolean;
  /** If true, overwrite existing files; otherwise skip */
  overwrite?: boolean;
}

export interface PostProcessorCtx {
  /** Absolute destination path (after name transforms) */
  absPath: string;
  /** Destination path relative to the provided targetDir */
  relPath: string;
  /** Final tokens used during replacement */
  tokens: TokenMap;
}

export interface PostProcessor {
  /**
   * Return true if this processor should run for the given file.
   * Inspect relPath/absPath to scope to specific files.
   */
  match: (relPath: string, absPath: string) => boolean;
  /**
   * Transform file content. Must be pure.
   */
  transform: (content: string, ctx: PostProcessorCtx) => string;
}

export interface InternalOptions extends ApplyTemplatesOptions {
  /** Optional list of names to ignore at each level (e.g., ['node_modules', '.DS_Store']). */
  ignore?: string[];
  /** Map template names starting with '_' to dotfiles on output (e.g., _gitignore → .gitignore). */
  enableDotfileRename?: boolean;
  /** Additional file extensions to treat as binary (appended to the default set). */
  binaryExtensions?: string[];
  /**
   * Optional content post-processing pipeline executed AFTER token replacement
   * and BEFORE writing to disk. Use to fix booleans, prettify, add headers, etc.
   */
  postProcessors?: PostProcessor[];
}
