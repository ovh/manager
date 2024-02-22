import ServicesConsumption from './_components/servicesConsumption';
import explore from './../../../../../../assets/ai-dashboard/explore.png';
import store from './../../../../../../assets/ai-dashboard/stock.png';
import train from './../../../../../../assets/ai-dashboard/train.png';
import deploy from './../../../../../../assets/ai-dashboard/serve.png';
import { useGetNotebooks } from '@/hooks/api/notebooks/useGetNotebooks';
import { useGetJobs } from '@/hooks/api/jobs/useGetJobs';
import { useGetApps } from '@/hooks/api/apps/useGetApps';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ai, user } from '@/models/types';
import BillingConsumption from './_components/billingConsumption';
import UserTokenConfiguration from './_components/userTokenConfiguration';
import { DashboardLayoutContext } from '../_layout';
import { useOutletContext } from 'react-router-dom';
export const Handle = {
  breadcrumb: () => 'Dashboard',
};

export default function DashboardHomePage() {
  const { projectId } = useRequiredParams<{ projectId: string }>();
  const { usersQuery, tokensQuery } = useOutletContext() as DashboardLayoutContext;
  const appsQuery = useGetApps(projectId, {
    refetchInterval: 30_000,
  });
  const notebooksQuery = useGetNotebooks(projectId, {
    refetchInterval: 30_000,
  });
  const jobsQuery = useGetJobs(projectId, {
    refetchInterval: 30_000,
  });

  const jobs : ai.job.Job[] = jobsQuery.data || [];
  const notebooks : ai.notebook.Notebook[] = notebooksQuery.data || [];
  const apps: ai.app.App[] = appsQuery.data || [];

  const runningApps: number =
    apps.filter(
      (app: ai.app.App) => app.status.state === ai.app.AppStateEnum.RUNNING,
    ).length || 0;
  const stoppedApps: number = (apps.length || 0) - runningApps;

  const runningJobs: number =
    jobs.filter(
      (job: ai.job.Job) =>
        job.status.state === ai.job.JobStateEnum.RUNNING ||
        job.status.state === ai.job.JobStateEnum.RESTARTING,
    ).length || 0;
  const stoppedJobs: number = (jobs.length || 0) - runningJobs;

  const runningNotebooks: number =
    notebooks.filter(
      (notebook: ai.notebook.Notebook) =>
        notebook.status.state === ai.notebook.NotebookStateEnum.RESTARTING ||
        notebook.status.state === ai.notebook.NotebookStateEnum.RUNNING,
    ).length || 0;
  const stoppedNotebooks: number =
    (notebooks.length || 0) - runningNotebooks;

  const activeTokens : number = tokensQuery.data?.length || 0; 
  const activeUsers : number = usersQuery.data?.filter((user : user.User) => user.roles.find((role : user.Role) => role.name === ai.TokenRoleEnum.ai_training_operator || role.name === ai.TokenRoleEnum.ai_training_read)).length || 0;

  return (
    <>
      <div className="grid w-full grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="w-auto">
          <ServicesConsumption
            imgLink={store}
            title="1. Store"
            titleLink="Object Storage"
            link="/objectStorage"
          />
        </div>
        <div className="w-auto">
          <ServicesConsumption
            imgLink={explore}
            title="2. Explore"
            titleLink="AI Notebooks"
            link="./../../notebooks"
            activeServices={runningNotebooks}
            stoppedServices={stoppedNotebooks}
          />
        </div>
        <div className="w-auto">
          <ServicesConsumption
            imgLink={train}
            title="3. Train"
            titleLink="AI Training"
            link="./../../jobs"
            activeServices={runningJobs}
            stoppedServices={stoppedJobs}
          />
        </div>
        <div className="w-auto">
          <ServicesConsumption
            imgLink={deploy}
            title="4. Deploy"
            titleLink="AI Deploy"
            link="./../../apps"
            activeServices={runningApps}
            stoppedServices={stoppedApps}
          />
        </div>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <BillingConsumption />
        <UserTokenConfiguration activeTokens={activeTokens} activeUsers={activeUsers} />
      </div>
    </>
  );
}
