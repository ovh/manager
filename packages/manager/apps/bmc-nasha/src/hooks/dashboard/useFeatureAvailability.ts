import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const FEATURE_BILLING_COMMITMENT = 'billing:commitment';
const FEATURE_EOL_LV1_LV2 = 'dedicated-nasha:eol-lv1-lv2';

export function useDashboardFeatureAvailability() {
  const { data, ...rest } = useFeatureAvailability([
    FEATURE_BILLING_COMMITMENT,
    FEATURE_EOL_LV1_LV2,
  ]);

  return {
    isCommitmentAvailable: data?.[FEATURE_BILLING_COMMITMENT] ?? false,
    isNashaLegacyServicesPeriod: data?.[FEATURE_EOL_LV1_LV2] ?? false,
    ...rest,
  };
}

