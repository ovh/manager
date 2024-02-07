import { Outlet } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';

import TabsMenu from '@/components/tabs-menu';
import { H2 } from '@/components/typography';

import { useGetNotebook } from '@/hooks/api/notebooks/useGetNotebook';
export const Handle = {
  breadcrumb: (params: { notebookId: string }) => params.notebookId,
};

export default function NotebookLayout() {
  const { projectId, notebookId } = useRequiredParams<{
    projectId: string;
    notebookId: string;
  }>();
  const notebookQuery = useGetNotebook(projectId, notebookId, {
    refetchInterval: 30_000,
  });
  const tabs = [
    { href: 'general-information', label: 'General information' },
    { href: 'attached-data', label: 'Attached data' },
  ];
  return (
    <>
      <H2>{notebookQuery.data?.spec.name ?? 'General information'}</H2>
      <p>{notebookQuery.data?.id ?? 'General information'}</p>
      <TabsMenu tabs={tabs} />
      <Outlet context={notebookQuery} />
    </>
  );
}
