import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey="crumb-training" namespace="ai-tools" />
  );
}

export default function Root() {
  return <Outlet />;
}
