import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';

// Share data with the child routes
export type ServiceLayoutContext<
  T extends database.Service = database.Service
> = {
  service: T;
  serviceQuery: UseQueryResult<T, Error>;
};
export const useServiceData = <
  T extends database.Service = database.Service
>() => {
  const { projectId, category, serviceId } = useParams();
  const serviceQuery = useGetService<T>(projectId, serviceId);
  return { projectId, category, service: serviceQuery.data, serviceQuery };
};
