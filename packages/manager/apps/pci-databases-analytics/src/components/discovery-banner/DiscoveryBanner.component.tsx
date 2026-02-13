import { Alert, AlertDescription, Button } from '@datatr-ux/uxlib';
import { ReactNode } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OvhLink from '../links/OvhLink.component';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import { PlanCode } from '@/types/cloud/Project';

const DiscoveryBanner = ({ children }: { children: ReactNode }) => {
  const projectData = usePciProject();
  const { t } = useTranslation(
    'pci-databases-analytics/components/discovery-banner',
  );
  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;
  if (!isProjectDiscoveryMode) {
    return null;
  }
  return (
    <Alert variant="warning">
      <div
        data-testid="discovery-container"
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
      >
        <div className="flex items-center gap-4">
          <AlertCircle className="h-6 w-6" />
          <AlertDescription>{children}</AlertDescription>
        </div>
        <Button
          className="whitespace-nowrap shrink-0 w-1/2 md:w-auto"
          type="button"
          asChild
        >
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
    </Alert>
  );
};

export default DiscoveryBanner;
