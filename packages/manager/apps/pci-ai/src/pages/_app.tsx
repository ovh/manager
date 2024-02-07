import ShellRoutingSync from "@/core/ShellRoutingSync";
import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';
import BreadCrumbs from '@/components/breadcrumb';

const MainLayout = () => {
    return (
      <main className="container mx-auto py-10 px-0">
        <BreadCrumbs />
        <ShellRoutingSync />
        <Outlet />
        <Toaster />
      </main>
    );
  };
export default MainLayout;