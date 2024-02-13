import { useEffect, useState } from 'react';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useQuery } from '@tanstack/react-query';

import { ai } from '@/models/types';
import { appsApi } from '@/data/aiapi';
import Onboarding from './_components/onboarding';
import AppsList from './_components/appsListTable';


export default function AppsPage() {
  const [apps, setApps] = useState<ai.app.App[]>([]);
  const { projectId } = useRequiredParams<{ projectId: string }>();

  const getAppsListQueryKey = ['/apps', projectId];

  const appsQuery = useQuery({
    queryKey: getAppsListQueryKey,
    queryFn: () => appsApi.getApps(projectId),
    refetchInterval: 30_000, // poll services every 30 sec
  });

  if (appsQuery.error)
    return <pre>{JSON.stringify(appsQuery.error)}</pre>;

  useEffect(() => {
    if (!appsQuery.data) return;
    setApps(appsQuery.data);
  });

  if (appsQuery.isLoading) return <AppsList.Skeleton />;

  const refetch = () => {
    appsQuery.refetch();
  };

  return (
    <>
      {apps.length > 0 ? (
        <AppsList
          apps={apps}
          projectId={projectId}
          refetchFn={refetch}
        />
      ) : (
        <Onboarding />
      )}
      </>
  );
}
