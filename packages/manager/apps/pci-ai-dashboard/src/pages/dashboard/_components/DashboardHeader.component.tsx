import { useTranslation } from 'react-i18next';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import NavLink from '@/components/links/NavLink.component';
import usePciProject from '@/hooks/api/project/useGetProjects.hook';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import OvhLink from '@/components/links/OvhLink.component';
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
        <Alert variant="warning">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('discoveryMode')}</p>
              </div>
              <Button variant="default" type="button" asChild>
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
      <NavLink to="https://www.ovhcloud.com/fr/public-cloud/prices/#ai-&-machine-learning">
        <div className="flex flex-row gap-1 items-center">
          {t('linkPrice')}
          <ArrowRight className="size-4 mt-1" />
        </div>
      </NavLink>
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
