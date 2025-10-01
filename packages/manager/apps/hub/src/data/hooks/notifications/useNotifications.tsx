import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getNotifications } from '@/data/api/notifications';
import { Notification } from '@/types/notifications.type';

export const useFetchHubNotifications = (
  options?: Partial<DefinedInitialDataOptions<Notification[], AxiosError>>,
) =>
  useQuery<Notification[], AxiosError>({
    ...options,
    queryKey: ['getHubNotifications'],
    queryFn: getNotifications,
    retry: 0,
  });
