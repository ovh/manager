import { useParams } from 'react-router-dom';

export type TRegistryId = string;

export const useRegistryId = (): TRegistryId => {
  const { registryId } = useParams();

  if (!registryId) throw new Error('Missing registryId');

  return registryId;
};
