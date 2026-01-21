import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { GuideMenu } from '@ovh-ux/muk';

import { KMS_FEATURES } from '@/common/utils/feature-availability/feature-availability.constants';
import { filterFalsy } from '@/common/utils/tools/filterFalsy';

import { useGuideItemKmip } from './guide-kmip/useGuideItemKmip';
import { useGuideItemQuickStart } from './guide-quick-start/useGuideItemQuickStart';
import { useGuideItemUsage } from './guide-usage/useGuideItemUsage';

export default function KmsGuidesHeader() {
  const { data: features, isPending } = useFeatureAvailability([
    KMS_FEATURES.KMS_USAGE_GUIDE,
    KMS_FEATURES.KMIP_CONNECTION_GUIDE,
  ]);

  const guideQuickStart = useGuideItemQuickStart(0);
  const guideUsage = useGuideItemUsage(1);
  const guideKmip = useGuideItemKmip(2);

  return (
    <GuideMenu
      isLoading={isPending}
      items={filterFalsy([
        guideQuickStart,
        features?.[KMS_FEATURES.KMS_USAGE_GUIDE] && guideUsage,
        features?.[KMS_FEATURES.KMIP_CONNECTION_GUIDE] && guideKmip,
      ])}
    />
  );
}
