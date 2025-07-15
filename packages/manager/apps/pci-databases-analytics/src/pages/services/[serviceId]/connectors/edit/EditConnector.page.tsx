import { useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useServiceData } from '../../Service.context';
import { useGetConnector } from '@/hooks/api/database/connector/useGetConnector.hook';
import AddEditConnector from '../_components/AddEditConnector.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb-edit"
      namespace="pci-databases-analytics/services/service/connectors"
    />
  );
}

const EditConnector = () => {
  const { connectorId } = useParams();
  const { projectId, service } = useServiceData();

  const connectorQuery = useGetConnector(
    projectId,
    service.engine,
    service.id,
    connectorId,
    {
      enabled: !!connectorId,
    },
  );

  const connectorToEdit = connectorQuery.data;
  return (
    <>
      {connectorToEdit && (
        <AddEditConnector connectorToEdit={connectorToEdit} />
      )}
    </>
  );
};

export default EditConnector;
