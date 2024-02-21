import { useEffect, useState } from 'react';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import { ai } from '@/models/types';
import Onboarding from './_components/onboarding';
import AppsList from './_components/appsListTable';
import { useGetApps } from '@/hooks/api/apps/useGetApps';


export default function AppsPage() {
  const [apps, setApps] = useState<ai.app.App[]>([]);
  const { projectId } = useRequiredParams<{ projectId: string }>();

  const appsQuery = useGetApps(projectId, {
    refetchInterval: 30_000,
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
