import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="replicationTab"
      namespace="pci-object-storage/storages/header-tabs"
    />
  );
}

const ReplicationLayout = () => {
  return <Outlet />;
};

export default ReplicationLayout;
