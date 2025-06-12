import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { useGetApp } from '@/data/hooks/ai/app/useGetApp.hook';

// Share data with the child routes
export type AppLayoutContext = {
  app: ai.app.App;
  appQuery: UseQueryResult<ai.app.App, Error>;
};
export const useAppData = () => {
  const { projectId, appId } = useParams();
  const appQuery = useGetApp(projectId, appId);
  return { projectId, app: appQuery.data, appQuery };
};
