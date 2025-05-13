import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export const featuresAvailabilityMock: Record<string, boolean> = {
  [FEATURES.KMIP_CONNECTION_GUIDE]: true,
  [FEATURES.KMS_USAGE_GUIDE]: true,
  [FEATURES.LOGS]: true,
};
