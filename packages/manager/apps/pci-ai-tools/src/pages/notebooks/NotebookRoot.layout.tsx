import { Outlet, redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey="crumb-notebook" namespace="ai-tools" />
  );
}

interface NotebooksProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: NotebooksProps) => {
  const { projectId } = params;
  const notebooks = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/notebooks'],
    queryFn: () => getNotebooks({ projectId }),
  });
  if (notebooks.length === 0) {
    return redirect(`/pci/projects/${projectId}/ai-ml/notebooks/onboarding`);
  }
  return null;
};

export default function Root() {
  return (
    <>
      <Breadcrumb />
      <Outlet />
    </>
  );
}
