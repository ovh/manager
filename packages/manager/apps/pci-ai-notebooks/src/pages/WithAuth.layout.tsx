import { Outlet, redirect } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import queryClient from '@/query.client';
import { getTest } from '@/data/api/test/test.api';

interface WithAuthLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// check if the user has authentication
export const Loader = async ({ params }: WithAuthLayoutProps) => {
  const { projectId } = params;
  try {
    const authResult = await queryClient.fetchQuery({
      queryKey: [projectId, 'alerting'],
      queryFn: () => getTest({ projectId }),
    });
    if (authResult.length === 0) {
      return redirect(`/pci/projects/${projectId}/ai/notebooks/auth`);
    }
  } catch (_error) {
    return redirect(`/pci/projects/${projectId}/ai/notebooks/auth`);
  }
  return null;
};

export default function Layout() {
  return (
    <>
      <Breadcrumb />
      <Outlet />
    </>
  );
}
