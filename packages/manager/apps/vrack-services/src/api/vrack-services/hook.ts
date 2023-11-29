import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getListingIcebergQueryKey, getTaskList } from './get';
import { Status } from '../api.type';

export type UseTaskPollingParams = {
  vrackServicesId: string;
  initialRefetchInterval?: number;
  pollingInterval?: number;
};

/**
 * Check for orders that contain a certain type of product and refresh the order untill it's delivered
 */
export const useTaskPolling = ({
  vrackServicesId,
  initialRefetchInterval = 0,
  pollingInterval = 30000,
}: UseTaskPollingParams) => {
  const queryClient = useQueryClient();
  const [refetchInterval, setRefetchInterval] = React.useState(
    initialRefetchInterval,
  );

  const query = useQuery({
    queryKey: ['taskPolling', vrackServicesId],
    queryFn: async () => {
      const response = await getTaskList({ vrackServicesId });
      if (response.data.every(({ status }) => status === Status.DONE)) {
        setRefetchInterval(0);
        queryClient.invalidateQueries({
          queryKey: getListingIcebergQueryKey,
        });
      }
      return response.data.filter(({ status }) => status !== Status.DONE);
    },
    refetchInterval,
  });

  React.useEffect(() => {
    if (query.data?.length > 0) {
      setRefetchInterval(pollingInterval);
    }
  }, [query.data?.length]);

  return query;
};
