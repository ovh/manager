import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ActionBanner } from '../action-banner.component';
import './translations/discovery';

const DISCOVERY_PROJECT_PLANCODE = 'project.discovery';

export const isDiscoveryProject = ({ planCode }: { planCode: string }) => {
  return planCode === DISCOVERY_PROJECT_PLANCODE;
};

export interface PciDiscoveryBannerProps {
  projectId: string;
}

export function PciDiscoveryBanner({
  projectId,
}: Readonly<PciDiscoveryBannerProps>) {
  const { navigateTo } = useNavigation();
  const activateDiscoveryProject = async () => {
    await navigateTo(
      'public-cloud',
      `#/pci/projects/${projectId}/activate`,
      {},
    );
  };
  const [t] = useTranslation('pci-discovery-banner');
  return (
    <ActionBanner
      message={t('pci_projects_project_activate_project_banner_message')}
      cta={t('pci_projects_project_activate_project_banner_cta')}
      type={ODS_MESSAGE_TYPE.warning}
      onClick={activateDiscoveryProject}
    />
  );
}
