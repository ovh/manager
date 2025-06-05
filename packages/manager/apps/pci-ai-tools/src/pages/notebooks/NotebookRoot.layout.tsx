import { Outlet, useParams } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

function ManageBreadcrumb() {
  const { quantum } = useParams();
  const translationKey =
    quantum === 'quantum' ? 'crumb-quantum' : 'crumb-notebook';
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
