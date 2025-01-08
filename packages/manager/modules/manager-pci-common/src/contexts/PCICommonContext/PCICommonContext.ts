import { createContext } from 'react';

export interface InternalMeta {
  has3AZ?: boolean;
}

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
