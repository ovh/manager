import { useContext } from 'react';
import {
  hasMetaProperty,
  InternalMeta,
  PCICommonContext,
  PCICommonMetaType,
} from '@/contexts/PCICommonContext/PCICommonContext';

function hasMetaHas3AZ(
  meta: PCICommonMetaType,
): meta is Pick<InternalMeta, 'has3AZ'> {
  return hasMetaProperty(meta, 'has3AZ') && typeof meta.has3AZ === 'boolean';
}

export const useHas3AZ = (): boolean => {
  const meta = useContext(PCICommonContext);

  return hasMetaHas3AZ(meta) ? meta.has3AZ : false;
};
