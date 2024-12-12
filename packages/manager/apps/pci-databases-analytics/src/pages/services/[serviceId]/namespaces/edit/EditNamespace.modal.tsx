import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useServiceData } from '../../Service.context';
import AddEditNamespace from '../_components/AddEditNamespace.component';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';

const EditNamespaceModal = () => {
  const { namespaceId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const namespacesQuery = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      enabled: !!service.id,
    },
  );
  const namespaces = namespacesQuery.data;
  const editedNamespace = namespaces?.find((n) => n.id === namespaceId);

  useEffect(() => {
    if (namespaces && !editedNamespace) navigate('../');
  }, [namespaces, editedNamespace]);

  if (!namespacesQuery.data) return <Skeleton className="w-full h-4" />;
  return (
    <AddEditNamespace
      namespaces={namespaces}
      service={service}
      editedNamespace={editedNamespace}
    />
  );
};

export default EditNamespaceModal;
