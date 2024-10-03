import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ActionBanner } from '@ovh-ux/manager-react-components';
import { useAnnouncementBanner } from './useAnnouncementBanner.hook';

import '../../../translations/announcement-banner';

type PciAnnouncementBannerProps = {
  projectId?: string;
};

export function PciAnnouncementBanner({
  projectId,
}: Readonly<PciAnnouncementBannerProps>) {
  const { t } = useTranslation('pci-announcement-banner');

  const { navigateTo } = useNavigation();
  const { isBannerVisible } = useAnnouncementBanner();

  const onGoToRegion = async () => {
    await navigateTo('public-cloud', `#/pci/projects/${projectId}/regions`, {});
  };

  return (
    <>
      {isBannerVisible && (
        <ActionBanner
          message={t('pci_projects_beta_public_cloud_banner_info')}
          cta={t('pci_projects_beta_public_cloud_banner_info_link')}
          onClick={onGoToRegion}
        />
      )}
    </>
  );
}
