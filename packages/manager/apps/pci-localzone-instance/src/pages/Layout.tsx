import { Outlet, LoaderFunction } from 'react-router-dom';
import BreadCrumbs from '@/components/BreadCrumbs';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

export const loader: LoaderFunction = async ({ params }) => {
  const { projectId } = params;

  return {
    project: { id: projectId },
  };
};

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
  return <h1>Error</h1>;
};
