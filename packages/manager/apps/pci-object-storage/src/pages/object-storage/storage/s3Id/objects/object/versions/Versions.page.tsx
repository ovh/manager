import { Outlet } from 'react-router-dom';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return <BreadcrumbItem translationKey="versions" namespace="" />;
}

const Versions = () => {
  return (
    <>
      <h2>Versions</h2>
      <Outlet />
    </>
  );
};

export default Versions;
