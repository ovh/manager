import { UseQueryResult } from '@tanstack/react-query';
import { useOutletContext, useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';

// Share data with the child routes
export type ServiceLayoutContext = {
  service: database.Service;
  serviceQuery: UseQueryResult<database.Service, Error>;
};
export const useServiceData = () => {
  const { projectId, category } = useParams();
  const { service, serviceQuery } = useOutletContext() as ServiceLayoutContext;
  return { projectId, category, service, serviceQuery };
};
