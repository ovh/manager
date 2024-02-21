import { ai } from '@/models/types';
import NotebooksList from './_components/notebookListTable';
import { useEffect, useState } from 'react';
import Onboarding from './_components/onboarding';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useGetNotebooks } from '@/hooks/api/notebooks/useGetNotebooks';

export default function NotebookPage() {
  const [notebooks, setNotebooks] = useState<ai.notebook.Notebook[]>([]);
  const { projectId } = useRequiredParams<{ projectId: string }>();

  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: 30_000,
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
