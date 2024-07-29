import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import storeImage from '@/../public/assets/stock.png';
import exploreImage from '@/../public/assets/explore.png';
import trainImage from '@/../public/assets/train.png';
import deployImage from '@/../public/assets/serve.png';

import ProductInformations from './_components/ProductInformations.component';
import { ai } from '@/types/ai';
import Guides from '@/components/guides/Guides.component';
import { useDashboardData } from '../Dashboard.context';

export default function Home() {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/home');
  const { notebooks, jobs, apps } = useDashboardData();
  const objectStoragePath = `projects/${projectId}/storages/objects`;
  const notebooksPath = `projects/${projectId}/ai/notebooks`;
  const jobsPath = `projects/${projectId}/ai/jobs`;
  const appsPath = `projects/${projectId}/ai/apps`;

  const isOnbording: boolean = !notebooks && !jobs && !apps;

  return (
    <>
      <div className="float-right">
        <Guides section="cli" />
      </div>
      <div className="flex flex-row justify-around">
        <ProductInformations
          img={storeImage}
          link={objectStoragePath}
          title={t('store-title')}
          productName={t('object-storage-title')}
          showConsumptionInfos={isOnbording}
        />
        <ProductInformations
          img={exploreImage}
          link={notebooksPath}
          title="2. Explore"
          productName="AI Notebooks"
          showConsumptionInfos={!isOnbording}
          active={
            notebooks &&
            notebooks.filter(
              (nb) => nb.status.state === ai.notebook.NotebookStateEnum.RUNNING,
            ).length
          }
          stopped={
            notebooks &&
            notebooks.filter(
              (nb) => nb.status.state !== ai.notebook.NotebookStateEnum.RUNNING,
            ).length
          }
        />
        <ProductInformations
          img={trainImage}
          link={jobsPath}
          title="3. Train"
          productName="AI Training"
          showConsumptionInfos={!isOnbording}
          active={
            jobs &&
            jobs.filter(
              (job) => job.status.state === ai.job.JobStateEnum.RUNNING,
            ).length
          }
          stopped={
            jobs &&
            jobs.filter(
              (job) => job.status.state !== ai.job.JobStateEnum.RUNNING,
            ).length
          }
        />
        <ProductInformations
          img={deployImage}
          link={appsPath}
          title="4. Deploy"
          productName="AI Deploy"
          showConsumptionInfos={!isOnbording}
          active={
            apps &&
            apps.filter(
              (app) => app.status.state === ai.app.AppStateEnum.RUNNING,
            ).length
          }
          stopped={
            apps &&
            apps.filter(
              (app) => app.status.state !== ai.app.AppStateEnum.RUNNING,
            ).length
          }
        />
      </div>
    </>
  );
}
