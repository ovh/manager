import { Outlet } from 'react-router-dom';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import BreadCrumbs from '@/components/breadcrumb';

const MainLayout = () => {
  return (
    <main className="container mx-auto py-10 px-0">
      <BreadCrumbs />
      <ShellRoutingSync />
      <Outlet />
    </main>
  );
};
export default MainLayout;
