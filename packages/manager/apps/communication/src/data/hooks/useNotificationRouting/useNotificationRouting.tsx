import {
  useQuery,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getNotificationRouting,
  getNotificationRoutingQueryKey,
  createRouting,
  deleteRouting,
  getNotificationRoutingListQueryKey,
  updateRouting,
} from '@/data/api/routing';
import {
  CreateRouting,
  CreateRoutingSchema,
  NotificationRouting,
} from '@/data/types';

type UseNotificationRoutingParams = {
  routingId?: string;
  enabled?: boolean;
};

export const useNotificationRouting = ({
  routingId,
  enabled = true,
}: UseNotificationRoutingParams): UseQueryResult<
  NotificationRouting,
  ApiError
> =>
  useQuery({
    queryKey: getNotificationRoutingQueryKey(routingId as string),
    queryFn: () => getNotificationRouting(routingId as string),
    enabled: Boolean(routingId && enabled),
  });

type UseCreateRoutingParams = {
  onSuccess?: (routing: NotificationRouting) => void;
  onError?: (error: ApiError) => void;
};
export const useCreateRouting = ({
  onSuccess,
  onError,
}: UseCreateRoutingParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRouting,
    onSuccess: async (routing: NotificationRouting) => {
      await queryClient.invalidateQueries({
        queryKey: getNotificationRoutingListQueryKey(),
      });
      onSuccess?.(routing);
    },
    onError,
  });
};

type UseUpdateRoutingParams = {
  routingId: string;
  onSuccess?: (routing: NotificationRouting) => void;
  onError?: (error: ApiError) => void;
};
export const useUpdateRouting = ({
  routingId,
  onSuccess,
  onError,
}: UseUpdateRoutingParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRouting) => updateRouting(routingId, data),
    onSuccess: async (routing: NotificationRouting) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getNotificationRoutingListQueryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: getNotificationRoutingQueryKey(routingId),
        }),
      ]);
      onSuccess?.(routing);
    },
    onError,
  });
};

export const useUpdateRoutingStatus = ({
  routingId,
  onSuccess,
  onError,
}: UseUpdateRoutingParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (active: boolean) => {
      const routing = await queryClient.fetchQuery<NotificationRouting>({
        queryKey: getNotificationRoutingQueryKey(routingId),
        queryFn: async () => getNotificationRouting(routingId),
      });
      return updateRouting(routingId, {
        ...CreateRoutingSchema.parse(routing),
        active,
      });
    },
    onSuccess: async (routing: NotificationRouting) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getNotificationRoutingListQueryKey(),
        }),
        queryClient.removeQueries({
          queryKey: getNotificationRoutingQueryKey(routing.id),
        }),
      ]);
      onSuccess?.(routing);
    },
    onError,
  });
};

type UseDeleteRoutingParams = {
  routingId: string;
  onSuccess?: (routing: NotificationRouting) => void;
  onError?: (error: ApiError) => void;
};
export const useDeleteRouting = ({
  routingId,
  onSuccess,
  onError,
}: UseDeleteRoutingParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteRouting(routingId),
    onSuccess: async (routing: NotificationRouting) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getNotificationRoutingListQueryKey(),
        }),
        queryClient.removeQueries({
          queryKey: getNotificationRoutingQueryKey(routingId),
        }),
      ]);
      onSuccess?.(routing);
    },
    onError,
  });
};
