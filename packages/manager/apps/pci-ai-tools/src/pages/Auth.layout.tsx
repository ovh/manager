import { Outlet, redirect } from 'react-router-dom';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import queryClient from '@/query.client';
import { getAuthorization } from '@/data/api/ai/authorization.api';
import PageLayout from '@/components/page-layout/PageLayout.component';

interface AuthLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// check if the user has authentication
export const Loader = async ({ params }: AuthLayoutProps) => {
  console.log('in Loader auth');
  const { projectId } = params;
  const authResult = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/authorization'],
    queryFn: () => getAuthorization({ projectId }),
  });
  if (!authResult.authorized) {
    return redirect(`/pci/projects/${projectId}/ai-ml/auth`);
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
