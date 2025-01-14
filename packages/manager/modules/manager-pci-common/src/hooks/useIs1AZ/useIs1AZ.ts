import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const FEATURE_REGION_1AZ = 'public-cloud:region-1AZ';

export const useIs1AZ = () => {
  const { data } = useFeatureAvailability([FEATURE_REGION_1AZ]);

  return data?.[FEATURE_REGION_1AZ] || false;
};
