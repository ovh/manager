import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ActionBanner } from '../action-banner.component';
import './translations';

const DISCOVERY_PROJECT_PLANCODE = 'project.discovery';

export const isDiscoveryProject = ({ planCode }: { planCode: string }) => {
  return planCode === DISCOVERY_PROJECT_PLANCODE;
};

export interface PciDiscoveryBannerProps {
  projectId: string;
}

export function PciDiscoveryBanner({ projectId }: PciDiscoveryBannerProps) {
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
      onClick={activateDiscoveryProject}
    />
  );
}
