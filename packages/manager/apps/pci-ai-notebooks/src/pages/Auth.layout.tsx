import { Outlet, redirect } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import queryClient from '@/query.client';
import { getAuthorization } from '@/data/api/ai/authorization.api';

interface AuthLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// check if the user has authentication
export const Loader = async ({ params }: AuthLayoutProps) => {
  const { projectId } = params;
  try {
    const authResult = await queryClient.fetchQuery({
      queryKey: [projectId, 'ai/authorization'],
      queryFn: () => getAuthorization({ projectId }),
    });
    if (!authResult.authorized) {
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
