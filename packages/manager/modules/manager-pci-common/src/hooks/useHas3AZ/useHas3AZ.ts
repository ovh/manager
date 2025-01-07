import { useContext } from 'react';
import { RegionMetaContext } from '../../contexts/RegionMetaContext';

export const useHas3AZ = (): boolean => {
  const meta = useContext(RegionMetaContext);

  return meta && 'has3AZ' in meta && typeof meta.has3AZ === 'boolean'
    ? meta.has3AZ
    : false;
};
