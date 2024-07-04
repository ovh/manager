import { Navigate, useParams, useSearchParams } from 'react-router-dom';

export const StorageActionRedirect = ({ action }: { action: string }) => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  return (
    <Navigate
      to={`/pci/projects/${projectId}/storages/blocks/${action}/${searchParams.get(
        'storageId',
      )}`}
      replace
    />
  );
};
