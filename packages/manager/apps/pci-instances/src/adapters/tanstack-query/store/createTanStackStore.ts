import { Store } from '@/domain/port/store';
import queryClient from '@/queryClient';

export const createTanStackStore = (): Store => ({
  get: (key?: string[]) => queryClient.getQueryData(key ?? []),
});
