import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, Button, Skeleton } from '@datatr-ux/uxlib';
import OvhLink from '@/components/links/OvhLink.component';
import A from '@/components/links/A.component';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { PlanCode } from '@/configuration/project';

export const DashboardHeader = () => {
  const { t } = useTranslation('pci-ai-dashboard');
  const projectData = usePciProject();

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;

  return (
    <div
      data-testid="service-header-container"
      className="flex flex-col gap-2 mt-4 mb-6"
    >
      <h2 data-testid="header-title">{t('title')}</h2>
      {isProjectDiscoveryMode && (
        <Alert>
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('discoveryMode')}</p>
              </div>
              <Button variant="neutral" mode="default" type="button" asChild>
                <OvhLink
                  className="hover:no-underline hover:text-primary-foreground"
                  application="public-cloud"
                  path={`#/pci/projects/${projectData.data?.project_id}/activate`}
                >
                  {t('discoveryModeActivate')}
                  <ArrowRight className="w-4 h-4 ml-2 mt-1" />
                </OvhLink>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <p>{t('paragraphe1')}</p>
      <p>{t('paragraphe2')}</p>

      <A
        href="https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('linkPrice')}
        <ArrowRight className="size-4 inline ml-2" />
      </A>
    </div>
  );
};

DashboardHeader.Skeleton = function ServiceHeaderSkeleton() {
  const { t } = useTranslation('pci-ai-dashboard');
  return (
    <div
      data-testid="dashboard-header-skeleton"
      className="flex flex-col gap-2 mt-4 mb-6"
    >
      <h2>{t('title')}</h2>
      <Skeleton className="w-full h-[150px]" />
      <Skeleton className="w-full h-[150px]" />
      <Skeleton className="w-full h-[400px]" />
    </div>
  );
};
