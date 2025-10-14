import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { NotificationRouting } from '@/data/types/routing.type';
import {
  getNotificationRouting,
  getNotificationRoutingQueryKey,
} from '@/data/api/routing';

export const useNotificationRouting = (): UseQueryResult<
  NotificationRouting[],
  ApiError
> =>
  useQuery({
    queryKey: getNotificationRoutingQueryKey(),
    queryFn: () => getNotificationRouting(),
  });
