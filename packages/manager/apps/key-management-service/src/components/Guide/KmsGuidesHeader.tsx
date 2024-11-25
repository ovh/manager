import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  GuideButton,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export default function KmsGuidesHeader() {
  const { t } = useTranslation('key-management-service/guide');
  const guideLinks = useGuideUtils();

  const { data: features } = useFeatureAvailability([
    FEATURES.KMS_USAGE_GUIDE,
    FEATURES.KMIP_CONNECTION_GUIDE,
  ]);

  const kmsGuides = [
    {
      id: 1,
      href: guideLinks?.quickStart,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('guides_header_quick_start'),
    },
  ];

  if (features?.[FEATURES.KMS_USAGE_GUIDE]) {
    kmsGuides.push({
      id: 2,
      href: guideLinks?.usage,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('guides_header_kms_usage'),
    });
  }
  if (features?.[FEATURES.KMIP_CONNECTION_GUIDE]) {
    kmsGuides.push({
      id: 3,
      href: guideLinks?.kmip,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('guides_header_connect_kmip_product'),
    });
  }

  return (
    <Suspense fallback={<OsdsSkeleton inline randomized />}>
      <GuideButton items={kmsGuides} />
    </Suspense>
  );
}
