import { createContext } from 'react';

export interface InternalMeta {
  applicationName?: string;
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

/**
 * Check if meta context has property
 * @param meta
 * @param property
 */
export function hasMetaProperty<K extends keyof InternalMeta>(
  meta: PCICommonMetaType,
  property: K,
): meta is Record<K, unknown> {
  return meta && property in meta;
}
