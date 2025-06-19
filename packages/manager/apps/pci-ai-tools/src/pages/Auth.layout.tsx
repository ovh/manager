import { Outlet, redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import { getAuthorization } from '@/data/api/ai/authorization.api';

interface AuthLayoutProps {
  params: {
    projectId: string;
    quantum: string;
  };
}
// check if the user has authentication
export const Loader = async ({ params }: AuthLayoutProps) => {
  const { projectId, quantum } = params;
  const authResult = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/authorization'],
    queryFn: () => getAuthorization({ projectId }),
  });
  if (!authResult.authorized) {
    return redirect(
      quantum === 'quantum'
        ? `/pci/projects/${projectId}/ai-ml/quantum/auth`
        : `/pci/projects/${projectId}/ai-ml/auth`,
    );
  }
  return null;
};

export default function Layout() {
  return <Outlet />;
}
