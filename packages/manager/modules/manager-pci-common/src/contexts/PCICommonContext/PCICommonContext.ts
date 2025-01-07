import { createContext, useContext, useMemo } from 'react';

interface InternalMeta {
  has3AZ?: boolean;
}

/**
 * We don't export it to avoid misusage
 *
 * This type is only used to add completion with LSP
 */
type PCICommonMetaType = InternalMeta | Record<string, unknown> | undefined;

/**
 * Use {usePCICommonContextFactory} for general usage.
 *
 * Use this to override previously set properties
 */
export const PCICommonContext = createContext<PCICommonMetaType>(undefined);

/**
 * Use this to merge meta properties with previously set properties (merge is only on level 1)
 *
 * To override all properties use the provider directly
 * @param meta
 */
export function usePCICommonContextFactory(meta?: PCICommonMetaType) {
  const base = useContext(PCICommonContext);

  return useMemo(() => ({ ...(base || {}), ...(meta || {}) }), [base, meta]);
}
