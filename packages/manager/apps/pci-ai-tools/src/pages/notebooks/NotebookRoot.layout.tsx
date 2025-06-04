import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { useQuantum } from '@/hooks/useQuantum.hook';

function ManageBreadcrumb() {
  const { isQuantum } = useQuantum('');

  const translationKey = isQuantum ? 'crumb-quantum' : 'crumb-notebook';
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
