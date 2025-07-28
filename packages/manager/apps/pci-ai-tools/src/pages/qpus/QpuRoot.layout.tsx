import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

function ManageBreadcrumb() {
  const translationKey = 'crumb-qpu';
  return (
    <BreadcrumbItem translationKey={translationKey} namespace="ai-tools" />
  );
}

export function breadcrumb() {
  return <ManageBreadcrumb />;
}

export default function Root() {
  return (
    <>
      <Outlet />
    </>
  );
}
