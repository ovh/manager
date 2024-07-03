import { useTranslation } from 'react-i18next';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-react-core-application';
import { ActionBanner } from '../action-banner.component';

import './translations';

export const pciAnnouncementBannerId = 'public-cloud:pci-announcement-banner';

export const useAnnouncementBanner = () => {
  const { data, isLoading } = useFeatureAvailability([pciAnnouncementBannerId]);

  return {
    isBannerVisible: data && !!data[pciAnnouncementBannerId],
    isLoading,
  };
};

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
