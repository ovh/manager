import { Outlet } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import TabsMenu from '@/components/tabs-menu';
import { H2 } from '@/components/typography';

import { useGetApp } from '@/hooks/api/apps/useGetApp';
export const Handle = {
  breadcrumb: (params: { appId: string }) => params.appId,
};

export default function AppLayout() {
  const { projectId, appId } = useRequiredParams<{
    projectId: string;
    appId: string;
  }>();
  const appQuery = useGetApp(projectId, appId, {
    refetchInterval: 30_000,
  });
  const tabs = [
    { href: 'general-information', label: 'General information' },
    { href: 'attached-data', label: 'Attached data' },
  ];
  return (
    <>
      <H2>{appQuery.data?.spec.name ?? 'General information'}</H2>
      <p>{appQuery.data?.id ?? 'General information'}</p>
      <TabsMenu tabs={tabs} />
      <Outlet context={appQuery} />
    </>
  );
}
