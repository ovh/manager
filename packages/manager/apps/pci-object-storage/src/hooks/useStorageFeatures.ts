import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { AVAILABILITY } from '@/constants';

export const useStorageFeatures = () => {
  const result = useFeatureAvailability([
    AVAILABILITY.LOCALZONE,
    AVAILABILITY['3AZ'],
  ]);
  return {
    ...result,
    isLocalZoneAvailable: result?.data?.[AVAILABILITY.LOCALZONE],
    is3azAvailable: result?.data?.[AVAILABILITY['3AZ']],
  };
};
