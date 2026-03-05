import { Outlet } from 'react-router-dom';
import { useServiceData } from '../Service.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export const breadcrumb = () => (
  <BreadcrumbItem
    translationKey="breadcrumb"
    namespace="pci-databases-analytics/services/service/connectors"
  />
);

const Connectors = () => {
  const parentOutletData = useServiceData();
  return <Outlet context={parentOutletData} />;
};

export default Connectors;
