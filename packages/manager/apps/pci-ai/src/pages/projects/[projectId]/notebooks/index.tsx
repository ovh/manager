import { useQuery } from '@tanstack/react-query';
import { notebookApi } from '@/data/aiapi';
import { ai } from '@/models/types';
import NotebooksList from './_components/notebookListTable';
import { useEffect, useState } from 'react';
import Onboarding from './_components/onboarding';
import { useRequiredParams } from '@/hooks/useRequiredParams';

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<ai.notebook.Notebook[]>([]);
  const { projectId } = useRequiredParams<{ projectId: string }>();

  const getNotebooksListQueryKey = ['/notebooks', projectId];

  const notebooksQuery = useQuery({
    queryKey: getNotebooksListQueryKey,
    queryFn: () => notebookApi.getNotebooks(projectId),
    refetchInterval: 30_000, // poll services every 30 sec
  });

  if (notebooksQuery.error)
    return <pre>{JSON.stringify(notebooksQuery.error)}</pre>;

  useEffect(() => {
    if (!notebooksQuery.data) return;
    setNotebooks(notebooksQuery.data);
  });

  if (notebooksQuery.isLoading) return <NotebooksList.Skeleton />;

  const refetch = () => {
    notebooksQuery.refetch();
  };

  return (
    <>
      {notebooks.length > 0 ? (
        <NotebooksList
          notebooks={notebooks}
          projectId={projectId}
          refetchFn={refetch}
        />
      ) : (
        <Onboarding />
      )}
    </>
  );
}
