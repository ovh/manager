import { useQuery } from '@tanstack/react-query';
import { getApplications } from '../api/applications';

export const useApplications = (enabled: boolean) =>
  useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
    enabled,
  });
