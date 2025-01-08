import { useContext, useMemo } from 'react';
import {
  PCICommonContext,
  PCICommonMetaType,
} from '../../contexts/PCICommonContext/PCICommonContext';

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
