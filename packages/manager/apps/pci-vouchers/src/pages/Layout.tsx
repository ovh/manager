import { Outlet } from 'react-router-dom';
import BreadCrumbs from '@/components/BreadCrumbs';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

export default function Layout() {
  return (
    <>
      <BreadCrumbs />
      <ShellRoutingSync />
      <HidePreloader />
      <Outlet />
    </>
  );
}

export const ErrorBoundary = () => {
  return (
    <>
      <h1>Error</h1>
      <ShellRoutingSync />
      <HidePreloader />
    </>
  );
};
