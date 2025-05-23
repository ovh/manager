import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, Skeleton } from '@datatr-ux/uxlib';
import { Activity, BrainCircuit, TerminalSquare } from 'lucide-react';
import ai from '@/types/AI';
import storeImage from '@/../public/assets/stock.png';
import exploreImage from '@/../public/assets/explore.png';
import trainImage from '@/../public/assets/train.png';
import deployImage from '@/../public/assets/serve.png';
import ProductInformations from './_components/ProductInformations.component';
import Guides from '@/components/guides/Guides.component';
import { useDashboardData } from '../Dashboard.context';
import Cli from './_components/Cli.component';
import Onboarding from './_components/Onboarding.component';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';

export default function Home() {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/dashboard/home');
  const { notebooks, jobs, apps } = useDashboardData();
  const regionQuery = useGetRegions(projectId);
  const objectStoragePath = `/pci/projects/${projectId}/storages/objects`;
  const notebooksPath = `/pci/projects/${projectId}/ai-ml/notebooks`;
  const jobsPath = `/pci/projects/${projectId}/ai-ml/training`;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 content-end">
            <ProductInformations
              img={storeImage}
              isInternalAppLink={false}
              link={objectStoragePath}
              title={t('store-title')}
              productName={t('object-storage-title')}
            />
            <ProductInformations
              img={exploreImage}
              isInternalAppLink={false}
              link={notebooksPath}
              title={t('explore-title')}
              productName={t('notebooks-title')}
              active={
                isOnbording
                  ? -1
                  : notebooks?.filter(
                      (nb) =>
                        nb.status.state ===
                        ai.notebook.NotebookStateEnum.RUNNING,
                    ).length || 0
              }
              stopped={
                isOnbording
                  ? -1
                  : notebooks?.filter(
                      (nb) =>
                        nb.status.state !==
                        ai.notebook.NotebookStateEnum.RUNNING,
                    ).length || 0
              }
            />
            <ProductInformations
              img={trainImage}
              link={jobsPath}
              isInternalAppLink={false}
              title={t('train-title')}
              productName={t('training-title')}
              active={
                isOnbording
                  ? -1
                  : jobs?.filter(
                      (job) => job.status.state === ai.job.JobStateEnum.RUNNING,
                    ).length || 0
              }
              stopped={
                isOnbording
                  ? -1
                  : jobs?.filter(
                      (job) => job.status.state !== ai.job.JobStateEnum.RUNNING,
                    ).length || 0
              }
            />
            <ProductInformations
              img={deployImage}
              isInternalAppLink={false}
              link={appsPath}
              title={t('deploy-title')}
              productName={t('ai-deploy-title')}
              active={
                isOnbording
                  ? -1
                  : apps?.filter(
                      (app) => app.status.state === ai.app.AppStateEnum.RUNNING,
                    ).length || 0
              }
              stopped={
                isOnbording
                  ? -1
                  : apps?.filter(
                      (app) => app.status.state !== ai.app.AppStateEnum.RUNNING,
                    ).length || 0
              }
            />
          </div>
        </CardContent>
      </Card>
      {isOnbording ? (
        <Onboarding />
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
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
          {/* Removed until current usage is deployed in the US
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
          </div> */}
        </div>
      )}
    </>
  );
}
