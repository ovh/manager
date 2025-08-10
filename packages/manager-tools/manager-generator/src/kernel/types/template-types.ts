import { TokenMap } from './tokens-types';

export interface ApplyTemplatesOptions {
  /** Absolute path to the template folder to copy from */
  templateDir: string;
  /** Absolute path to the target folder to write into */
  targetDir: string;
  /** Tokens used to replace {{TOKEN}} placeholders */
  tokens: TokenMap;
  /** If true, prints actions but does not write files */
  dryRun?: boolean;
  /** If true, overwrite existing files; otherwise skip */
  overwrite?: boolean;
}

export type InternalOptions = ApplyTemplatesOptions & {
  /** Optional list of relative names to ignore (e.g., ['node_modules', '.DS_Store']). */
  ignore?: string[];
  /** Map template names like `_gitignore` → `.gitignore` (default true). */
  enableDotfileRename?: boolean;
  /** Skip token replacement for these file extensions (treated as binary). */
  binaryExtensions?: string[];
};
