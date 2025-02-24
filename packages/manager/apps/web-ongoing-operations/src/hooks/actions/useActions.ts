import { operation } from '@/data/api/ongoing-operations-actions';

export const useDoOperation = async (
  universe: string,
  id: number,
  operationType: string,
) => {
  try {
    return await operation(universe, id, operationType);
  } catch (e) {
    return null;
  }
};
