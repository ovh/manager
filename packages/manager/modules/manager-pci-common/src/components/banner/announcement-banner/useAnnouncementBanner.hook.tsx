import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';

export const pciAnnouncementBannerId = 'public-cloud:pci-announcement-banner';

const getAnnouncementBannerFeatureAvailability = async () => {
  const result = await aapi.get(
    `/feature/${pciAnnouncementBannerId}/availability`,
  );

  return result.data[pciAnnouncementBannerId];
};

export const useAnnouncementBanner = () => {
  const { data, isLoading } = useQuery<boolean>({
    queryKey: [pciAnnouncementBannerId],
    queryFn: getAnnouncementBannerFeatureAvailability,
  });

  return {
    isBannerVisible: data,
    isLoading,
  };
};
