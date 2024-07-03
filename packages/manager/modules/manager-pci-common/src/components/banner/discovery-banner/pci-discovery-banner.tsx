import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { TProject } from '@/api/project/project.type';

import './translations';
import { ActionBanner } from '../action-banner.component';

const DISCOVERY_PROJECT_PLAN_CODE = 'project.discovery';

export const isDiscoveryProject = ({ planCode }: { planCode: string }) =>
  planCode === DISCOVERY_PROJECT_PLAN_CODE;

export interface PciDiscoveryBannerProps {
  project: TProject;
}

export function PciDiscoveryBanner({
  project,
}: Readonly<PciDiscoveryBannerProps>) {
  const { t } = useTranslation('pci-discovery-banner');

  const { navigateTo } = useNavigation();

  const activateDiscoveryProject = async () => {
    await navigateTo(
      'public-cloud',
      `#/pci/projects/${project.project_id}/activate`,
      {},
    );
  };

  return (
    <>
      {isDiscoveryProject(project) && (
        <ActionBanner
          message={t('pci_projects_project_activate_project_banner_message')}
          cta={t('pci_projects_project_activate_project_banner_cta')}
          type={ODS_MESSAGE_TYPE.warning}
          onClick={activateDiscoveryProject}
        />
      )}
    </>
  );
}
