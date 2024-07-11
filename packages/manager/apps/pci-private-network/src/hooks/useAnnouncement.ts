import { useFeatureAvailability } from '@ovhcloud/manager-components';
import { pciAnnouncementBannerId } from '@/constants';

export const useAnnouncementBanner = () => {
  const { data, isLoading } = useFeatureAvailability([pciAnnouncementBannerId]);
  return {
    isBannerVisible: data && !!data[pciAnnouncementBannerId],
    isLoading,
  };
};
