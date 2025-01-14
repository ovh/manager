import { createContext } from 'react';

// This is keep for future usage
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InternalMeta {}

/**
 * This type is only used to add completion with LSP
 */
export type PCICommonMetaType =
  | InternalMeta
  | Record<string, unknown>
  | undefined;

/**
 * Use {usePCICommonContextFactory} for general usage.
 *
 * Use this to override previously set properties
 */
export const PCICommonContext = createContext<PCICommonMetaType>(undefined);
