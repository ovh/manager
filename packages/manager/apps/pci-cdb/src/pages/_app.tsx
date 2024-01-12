import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import BreadCrumbs from '@/components/breadcrumb';

const MainLayout = () => {
  return (
    <main className="mx-auto pt-14 px-4 md:px-12">
      <BreadCrumbs />
      <ShellRoutingSync />
      <Outlet />
      <Toaster />
    </main>
  );
};
export default MainLayout;
