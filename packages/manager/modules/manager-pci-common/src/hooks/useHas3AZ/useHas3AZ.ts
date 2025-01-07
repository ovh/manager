import { useContext } from 'react';
import { PCICommonContext } from '../../contexts/PCICommonContext/PCICommonContext';

export const useHas3AZ = (): boolean => {
  const meta = useContext(PCICommonContext);

  return meta && 'has3AZ' in meta && typeof meta.has3AZ === 'boolean'
    ? meta.has3AZ
    : false;
};
