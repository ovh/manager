import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import Notebooks from './notebooks/Notebooks.page';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import { getAuthorization } from '@/data/api/ai/authorization.api';

interface NotebooksProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = ({ params }: NotebooksProps) => {
  // check if we have a correct category
  const { projectId } = params;

  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'auth'],
      queryFn: () => getAuthorization({ projectId }),
    })
    .then((auth) => {
      if (!auth) {
        return redirect(
          `/pci/projects/${projectId}/ai/notebooks/authorization`,
        );
      }
      return queryClient
        .fetchQuery({
          queryKey: [projectId, 'ai/notebooks'],
          queryFn: () => getNotebooks({ projectId }),
        })
        .then((notebooks) => {
          if (notebooks.length === 0) {
            return redirect(
              `/pci/projects/${projectId}/ai/notebooks/onboarding`,
            );
          }
          return null;
        });
    });
};

export default function Root() {
  return <Notebooks />;
}
