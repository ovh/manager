/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';
import { useResourcesV6 } from '@ovh-ux/manager-react-components';

export const useNashaListing = () => {
  const { data, isLoading, error } = useResourcesV6({
    route: '/dedicated/nasha',
    queryKey: ['nasha', 'listing'],
    columns: [],
  });

  return {
    data: data?.data || [],
    isLoading,
    error,
  };
};
