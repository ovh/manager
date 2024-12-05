import { Outlet, redirect, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { POLLING } from '@/configuration/polling.constants';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { getNotebook } from '@/data/api/ai/notebook/notebook.api';
import { useGetNotebook } from '@/hooks/api/ai/notebook/useGetNotebook.hook';
import { NotebookLayoutContext } from './Notebook.context';
import { NotebookHeader } from './_components/NotebookHeader.component';
import NotebookTabs from './_components/NotebookTabs.component';

interface NotebookLayoutProps {
  params: {
    projectId: string;
    notebookId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: NotebookLayoutProps) => {
  const { projectId, notebookId } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'ai/notebook', notebookId],
      queryFn: () => getNotebook({ projectId, notebookId }),
    })
    .then(
      () => null,
      () => redirect(`/pci/projects/${projectId}/ai/notebooks`),
    );
};

function NotebookName() {
  const { projectId, notebookId } = useParams();
  if (!notebookId) return '';
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return notebookQuery.isSuccess ? (
    notebookQuery.data.spec.name
  ) : (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  );
}

export function breadcrumb() {
  return <NotebookName />;
}

export default function NotebookLayout() {
  const { isUserActive } = useUserActivityContext();
  const { projectId, notebookId } = useParams();
  const notebookQuery = useGetNotebook(projectId, notebookId, {
    refetchInterval: isUserActive && POLLING.NOTEBOOK,
  });

  const notebook = notebookQuery.data;
  if (!notebook) {
    return (
      <>
        <NotebookHeader.Skeleton />
        <TabsMenu.Skeleton />
        Loading your notebook data
      </>
    );
  }
  const notebookLayoutContext: NotebookLayoutContext = {
    notebook,
    notebookQuery,
  };

  return (
    <>
      <NotebookHeader notebook={notebook} />
      <NotebookTabs notebook={notebook} />
      <div className="space-y-2">
        <Outlet context={notebookLayoutContext} />
      </div>
    </>
  );
}
