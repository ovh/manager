import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import { getStorages } from '@/data/api/storage/storages.api';

interface ObjectStorageProps {
  params: {
    projectId: string;
  };
  request: Request;
}
export const Loader = ({ params }: ObjectStorageProps) => {
  // check if we have a correct category
  const { projectId } = params;
  // check if we have a correct projectId
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'storages'],
      queryFn: () =>
        getStorages({ projectId, archive: false, withObjects: false }),
    })
    .then((container) => {
      if (container.resources.length === 0) {
        return redirect(
          `/pci/projects/${projectId}/storages/objects/onboarding`,
        );
      }
      return null;
    });
};
