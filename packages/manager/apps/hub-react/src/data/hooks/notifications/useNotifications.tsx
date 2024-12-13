import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from '@/types/notifications.type';
import { getNotifications } from '@/data/api/notifications';

export const useFetchHubNotifications = (
  options?: Partial<DefinedInitialDataOptions<Notification[], AxiosError>>,
) =>
  useQuery<Notification[], AxiosError>({
    ...options,
    queryKey: ['getHubNotifications'],
    queryFn: getNotifications,
    retry: 0,
  });
