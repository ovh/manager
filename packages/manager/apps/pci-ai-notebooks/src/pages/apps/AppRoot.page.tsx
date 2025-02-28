import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { getApps } from '@/data/api/ai/app/app.api';
import Apps from './Apps.page';

export function breadcrumb() {
  return <BreadcrumbItem translationKey="Apps" namespace="pci-ai-apps" />;
}

interface AppsProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: AppsProps) => {
  const { projectId } = params;
  const apps = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/apps'],
    queryFn: () => getApps({ projectId }),
  });
  if (apps.length === 0) {
    return redirect(`/pci/projects/${projectId}/ai/apps/onboarding`);
  }
  return null;
};

export default function Root() {
  return <Apps />;
}
