import { KMS_FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export const featuresAvailabilityMock: Record<string, boolean> = {
  [KMS_FEATURES.KMIP_CONNECTION_GUIDE]: true,
  [KMS_FEATURES.KMS_USAGE_GUIDE]: true,
  [KMS_FEATURES.LOGS]: true,
};
