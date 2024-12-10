import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { useGetService } from '@/hooks/api/database/service/useGetService.hook';

// Share data with the child routes
export type ServiceLayoutContext = {
  service: database.Service;
  serviceQuery: UseQueryResult<database.Service, Error>;
};
export const useServiceData = () => {
  const { projectId, category, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId);
  return { projectId, category, service: serviceQuery.data, serviceQuery };
};
