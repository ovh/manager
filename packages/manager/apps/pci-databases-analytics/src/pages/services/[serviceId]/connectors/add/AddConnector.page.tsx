import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import AddEditConnector from '../_components/AddEditConnector.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb-add"
      namespace="pci-databases-analytics/services/service/connectors"
    />
  );
}

const AddConnector = () => {
  return <AddEditConnector />;
};

export default AddConnector;
