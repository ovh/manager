import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  BrainCircuit,
  CircleDollarSign,
  TerminalSquare,
} from 'lucide-react';
import storeImage from '@/../public/assets/stock.png';
import exploreImage from '@/../public/assets/explore.png';
import trainImage from '@/../public/assets/train.png';
import deployImage from '@/../public/assets/serve.png';

import ProductInformations from './_components/ProductInformations.component';
import * as ai from '@/types/cloud/project/ai';
import Guides from '@/components/guides/Guides.component';
import { useDashboardData } from '../Dashboard.context';
import Cli from './_components/Cli.component';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Billing from './_components/Billing.components';
import Onboarding from './_components/Onboarding.component';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/home');
  const { notebooks, jobs, apps } = useDashboardData();
  const regionQuery = useGetRegions(projectId);
  const objectStoragePath = `/pci/projects/${projectId}/storages/objects`;
  const notebooksPath = `/pci/projects/${projectId}/notebooks`;
  const jobsPath = `/pci/projects/${projectId}/training/jobs`;
  const appsPath = `/pci/projects/${projectId}/ai/apps`;

  const isOnbording: boolean =
    notebooks.length === 0 && jobs.length === 0 && apps.length === 0;

  if (regionQuery.isLoading) {
    return (
      <div
        data-testid="home-page-skeleton"
        className="flex justify-between mb-2 items-end"
      >
        <Skeleton className="h-30 w-full" />
        <div className="flex gap-1">
          <Skeleton className="h-15 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="float-right pr-2 pt-2">
        <Guides />
      </div>
      <Card data-testid="product-life-card">
        <CardHeader>
          {isOnbording ? (
            <div className="flex flex-row items-center">
              <BrainCircuit className="size-4 inline mr-2" />
              <h4>{t('onboardingTitle')}</h4>
            </div>
          ) : (
            <div className="flex flex-row items-center">
              <Activity className="size-4 inline mr-2" />
              <h4>{t('serviceTitle')}</h4>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 content-end">
            <ProductInformations
              img={storeImage}
              link={objectStoragePath}
              title={t('store-title')}
              productName={t('object-storage-title')}
              showConsumptionInfos={false}
            />
            <ProductInformations
              img={exploreImage}
              link={notebooksPath}
              title={t('explore-title')}
              productName={t('notebooks-title')}
              showConsumptionInfos={!isOnbording}
              active={
                notebooks?.filter(
                  (nb) =>
                    nb.status.state === ai.notebook.NotebookStateEnum.RUNNING,
                ).length
              }
              stopped={
                notebooks?.filter(
                  (nb) =>
                    nb.status.state !== ai.notebook.NotebookStateEnum.RUNNING,
                ).length
              }
            />
            <ProductInformations
              img={trainImage}
              link={jobsPath}
              title={t('train-title')}
              productName={t('training-title')}
              showConsumptionInfos={!isOnbording}
              active={
                jobs?.filter(
                  (job) => job.status.state === ai.job.JobStateEnum.RUNNING,
                ).length
              }
              stopped={
                jobs?.filter(
                  (job) => job.status.state !== ai.job.JobStateEnum.RUNNING,
                ).length
              }
            />
            <ProductInformations
              img={deployImage}
              link={appsPath}
              title={t('deploy-title')}
              productName={t('ai-deploy-title')}
              showConsumptionInfos={!isOnbording}
              active={
                apps?.filter(
                  (app) => app.status.state === ai.app.AppStateEnum.RUNNING,
                ).length
              }
              stopped={
                apps?.filter(
                  (app) => app.status.state !== ai.app.AppStateEnum.RUNNING,
                ).length
              }
            />
          </div>
        </CardContent>
      </Card>
      {isOnbording ? (
        <Onboarding />
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center">
                  <TerminalSquare className="size-4 inline mr-2" />
                  <h4>{t('cliTitle')}</h4>
                </div>
              </CardHeader>
              <CardContent>
                {regionQuery.isSuccess && <Cli regions={regionQuery.data} />}
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center">
                  <CircleDollarSign className="size-4 inline mr-2" />
                  <h4>{t('billingTitle')}</h4>
                </div>
              </CardHeader>
              <CardContent>{!isOnbording && <Billing />}</CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
