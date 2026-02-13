import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

const breadcrumb = () => (
  <BreadcrumbItem
    translationKey="replicationTab"
    namespace="pci-object-storage/storages/header-tabs"
  />
);

const Replication = () => <Outlet />;

export { breadcrumb };
export default Replication;
