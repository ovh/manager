import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { GuideButton, GuideItem } from '@ovh-ux/manager-react-components';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export default function KmsGuidesHeader() {
  const { t } = useTranslation('key-management-service/guide');
  const guideLinks = useGuideUtils();
  const { trackClick } = useOvhTracking();

  const { data: features, isPending } = useFeatureAvailability([
    FEATURES.KMS_USAGE_GUIDE,
    FEATURES.KMIP_CONNECTION_GUIDE,
  ]);

  const handleTrackClick = (action: string) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.externalLink,
      actionType: 'navigation',
      actions: [action],
    });
  };

  const kmsGuides: GuideItem[] = React.useMemo(
    () =>
      [
        {
          id: 1,
          href: guideLinks?.quickStart,
          target: '_blank',
          label: t('guides_header_quick_start'),
          dataTestid: 'guides_header_quick_start',
          onClick: () => handleTrackClick('go-to-quick-start-guide'),
        },
        features?.[FEATURES.KMS_USAGE_GUIDE] && {
          id: 2,
          href: guideLinks?.usage,
          target: '_blank',
          label: t('guides_header_kms_usage'),
          dataTestid: 'guides_header_kms_usage',
          onClick: () => handleTrackClick('go-to-use-ovh-kms'),
        },
        features?.[FEATURES.KMIP_CONNECTION_GUIDE] && {
          id: 3,
          href: guideLinks?.kmip,
          target: '_blank',
          label: t('guides_header_connect_kmip_product'),
          dataTestid: 'guides_header_connect_kmip_product',
          onClick: () => handleTrackClick('connect-product-kmip'),
        },
      ].filter(Boolean),
    [guideLinks, t, features],
  );

  return (
    <Suspense fallback={<GuideButton isLoading items={kmsGuides} />}>
      <GuideButton isLoading={isPending} items={kmsGuides} />
    </Suspense>
  );
}
