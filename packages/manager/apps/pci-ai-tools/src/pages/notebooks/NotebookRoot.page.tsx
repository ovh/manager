import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import Notebooks from './Notebooks.page';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';

interface NotebooksProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: NotebooksProps) => {
  const { projectId } = params;
  const notebooks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/notebooks'],
    queryFn: () => getNotebooks({ projectId }),
  });
  if (notebooks.length === 0) {
    return redirect(
      `/pci/projects/${projectId}/ai/notebooks/notebooks/onboarding`,
    );
  }
  return null;
};

export default function Root() {
  return <Notebooks />;
}
