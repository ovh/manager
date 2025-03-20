import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useGetNotebook } from '@/data/hooks/ai/notebook/useGetNotebook.hook';
import ai from '@/types/AI';

// Share data with the child routes
export type NotebookLayoutContext = {
  notebook: ai.notebook.Notebook;
  notebookQuery: UseQueryResult<ai.notebook.Notebook, Error>;
};
export const useNotebookData = () => {
  const { projectId, notebookId } = useParams();
  const notebookQuery = useGetNotebook(projectId, notebookId);
  return { projectId, notebook: notebookQuery.data, notebookQuery };
};
