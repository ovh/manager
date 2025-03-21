import { Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import AddEditNamespace from '../_components/AddEditNamespace.component';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';

const AddNamespaceModal = () => {
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

  if (!namespacesQuery.data) return <Skeleton className="w-full h-4" />;
  return <AddEditNamespace namespaces={namespaces} service={service} />;
};

export default AddNamespaceModal;
