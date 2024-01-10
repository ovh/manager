import { Outlet } from 'react-router-dom';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import BreadCrumbs from '@/components/breadcrumb';

const MainLayout = () => {
  return (
    <main className="container mx-auto pt-14 px-4 md:px-12">
      <BreadCrumbs />
      <ShellRoutingSync />
      <Outlet />
    </main>
  );
};
export default MainLayout;
