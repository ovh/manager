import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ActionBanner } from '../action-banner.component';

import './translations/announcement';

interface PciAnnouncementBannerProps {
  projectId?: string;
}

export function PciAnnouncementBanner({
  projectId,
}: PciAnnouncementBannerProps) {
  const { t } = useTranslation('pci-announcement-banner');

  const { navigateTo } = useNavigation();

  const onGoToRegion = async () => {
    await navigateTo('public-cloud', `#/pci/projects/${projectId}/regions`, {});
  };

  return (
    <ActionBanner
      message={t('pci_projects_beta_public_cloud_banner_info')}
      cta={t('pci_projects_beta_public_cloud_banner_info_link')}
      onClick={onGoToRegion}
    />
  );
}
