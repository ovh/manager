import { queryKey } from '../queryKey';

export const regionsQueryKey = (projectId: string) => queryKey(projectId, ['regions']);
