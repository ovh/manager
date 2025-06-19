import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, Button, Skeleton } from '@datatr-ux/uxlib';
import OvhLink from '@/components/links/OvhLink.component';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { PlanCode } from '@/configuration/project';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { DashboardRoadmapLinks } from '@/configuration/roadmap-changelog.constants';
import { useQuantum } from '@/hooks/useQuantum.hook';

export const DashboardHeader = () => {
  const { t } = useQuantum('ai-tools/dashboard');
  const projectData = usePciProject();

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;

  return (
    <div
      data-testid="service-header-container"
      className="flex flex-col gap-2 mt-4 mb-6"
    >
      <div className="flex flex-row justify-between">
        <h2 data-testid="header-title">{t('title')}</h2>
        <RoadmapChangelog links={DashboardRoadmapLinks} />
      </div>
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
    </div>
  );
};

DashboardHeader.Skeleton = function ServiceHeaderSkeleton() {
  const { t } = useQuantum('ai-tools/dashboard');
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
