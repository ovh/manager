import { Outlet } from 'react-router-dom';
import { useServiceData } from '../Service.context';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="breadcrumb"
      namespace="pci-databases-analytics/services/service/settings"
    />
  );
}

export default function BackupLayout() {
  const parentOutletData = useServiceData();
  return <Outlet context={parentOutletData} />;
}
