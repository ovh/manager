import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useS3Data } from '../S3.context';

export function breadcrumb() {
  return <BreadcrumbItem translationKey="Objects" namespace="" />;
}

export default function Layout() {
  const parentOutletData = useS3Data();
  return <Outlet context={parentOutletData} />;
}
