import { UseQueryResult } from '@tanstack/react-query';
import { useOutletContext, useParams } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';

// Share data with the child routes
export type NotebookLayoutContext = {
  notebook: ai.notebook.Notebook;
  notebookQuery: UseQueryResult<ai.notebook.Notebook, Error>;
};
export const useNotebookData = () => {
  const { projectId } = useParams();
  const {
    notebook,
    notebookQuery,
  } = useOutletContext() as NotebookLayoutContext;
  return { projectId, notebook, notebookQuery };
};
