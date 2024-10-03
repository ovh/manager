import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Notification } from '@/types/notifications.type';
import { getNotifications } from '@/data/api/notifications';

export const useFetchHubNotifications = () =>
  useQuery<Notification[], AxiosError>({
    queryKey: ['getHubNotifications'],
    queryFn: getNotifications,
    retry: 0,
    refetchOnWindowFocus: false,
  });
