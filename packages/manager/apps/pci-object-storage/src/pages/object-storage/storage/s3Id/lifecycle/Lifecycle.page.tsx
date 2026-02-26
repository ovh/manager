import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="lifecycleTab"
      namespace="pci-object-storage/storages/header-tabs"
    />
  );
}

const LifecycleLayout = () => {
  return <Outlet />;
};

export default LifecycleLayout;
