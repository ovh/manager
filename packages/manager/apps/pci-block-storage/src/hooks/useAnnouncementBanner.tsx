import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const PCI_ANNOUNCEMENT_BANNER_FEATURE =
  'public-cloud:pci-announcement-banner';

export const useAnnouncementBanner = () => {
  const { data, isLoading } = useFeatureAvailability([
    PCI_ANNOUNCEMENT_BANNER_FEATURE,
  ]);
  return {
    isBannerVisible: data && !!data[PCI_ANNOUNCEMENT_BANNER_FEATURE],
    isLoading,
  };
};
