import { useOutletContext, useParams } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';

export type DashboardLayoutContext = {
  notebooks: ai.notebook.Notebook[];
  jobs: ai.job.Job[];
  apps: ai.app.App[];
};

export function useDashboardData() {
  const { projectId } = useParams();
  const {
    notebooks,
    jobs,
    apps,
  } = useOutletContext() as DashboardLayoutContext;
  return { projectId, notebooks, jobs, apps };
}
