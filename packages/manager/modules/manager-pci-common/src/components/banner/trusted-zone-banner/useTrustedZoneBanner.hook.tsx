import { useQuery } from '@tanstack/react-query';
import { aapi } from '@ovh-ux/manager-core-api';

export const pciTrustedZoneBannerId = 'public-cloud:trusted-zone';

const getTrustedZoneBannerFeatureAvailability = async () => {
  const result = await aapi.get(
    `/feature/${pciTrustedZoneBannerId}/availability`,
  );

  return result.data[pciTrustedZoneBannerId];
};

export const useTrustedZoneBanner = () => {
  const { data, isLoading } = useQuery<boolean>({
    queryKey: [pciTrustedZoneBannerId],
    queryFn: getTrustedZoneBannerFeatureAvailability,
  });

  return {
    isBannerVisible: data,
    isLoading,
  };
};
