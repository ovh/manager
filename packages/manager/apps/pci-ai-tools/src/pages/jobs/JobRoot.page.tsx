import { redirect } from 'react-router-dom';
import queryClient from '@/query.client';
import { getJobs } from '@/data/api/ai/job/job.api';
import Jobs from './Jobs.page';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return <BreadcrumbItem translationKey="Training" namespace="pci-ai-jobs" />;
}

interface JobsProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: JobsProps) => {
  const { projectId } = params;
  const jobs = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai/jobs'],
    queryFn: () => getJobs({ projectId }),
  });
  if (jobs.length === 0) {
    return redirect(
      `/pci/projects/${projectId}/ai/notebooks/training/onboarding`,
    );
  }
  return null;
};

export default function Root() {
  return <Jobs />;
}
