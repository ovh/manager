import { Alert, AlertDescription, Button } from '@datatr-ux/uxlib';
import { ReactNode } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OvhLink from '../links/OvhLink.component';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
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
      <AlertDescription className="text-base">
        <div
          data-testid="discovery-container"
          className="flex flex-col items-stretch md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex flex-row gap-5 items-center">
            <AlertCircle className="h-6 w-6" />
            {children}
          </div>
          <Button type="button" asChild>
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
  );
};

export default DiscoveryBanner;
