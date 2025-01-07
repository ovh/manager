import { useContext } from 'react';
import { MetaContext } from '../../contexts/MetaContext';

export const useHas3AZ = (): boolean => {
  const meta = useContext(MetaContext);

  return meta && 'has3AZ' in meta && typeof meta.has3AZ === 'boolean'
    ? meta.has3AZ
    : false;
};
