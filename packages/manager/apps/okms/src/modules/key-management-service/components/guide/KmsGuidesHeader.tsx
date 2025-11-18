import { GuideButton } from '@ovh-ux/manager-react-components';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { useGuideItemQuickStart } from './guide-quick-start/useGuideItemQuickStart';
import { useGuideItemUsage } from './guide-usage/useGuideItemUsage';
import { useGuideItemKmip } from './guide-kmip/useGuideItemKmip';

export default function KmsGuidesHeader() {
  const { data: features, isPending } = useFeatureAvailability([
    KMS_FEATURES.KMS_USAGE_GUIDE,
    KMS_FEATURES.KMIP_CONNECTION_GUIDE,
  ]);

  const guideQuickSart = useGuideItemQuickStart(0);
  const guideUsage = useGuideItemUsage(1);
  const guideKmip = useGuideItemKmip(2);

  return (
    <GuideButton
      isLoading={isPending}
      items={[
        guideQuickSart,
        features?.[KMS_FEATURES.KMS_USAGE_GUIDE] && guideUsage,
        features?.[KMS_FEATURES.KMIP_CONNECTION_GUIDE] && guideKmip,
      ].filter(Boolean)}
    />
  );
}
