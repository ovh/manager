import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { GuideButton } from '@ovhcloud/manager-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

export default function KmsGuidesHeader() {
  const { t } = useTranslation('key-management-service/guide');
  const guideLinks = useGuideUtils();

  const kmsGuides = [
    {
      id: 1,
      href: guideLinks?.quickStart,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('guides_header_find_out_more'),
    },
  ];

  return <GuideButton items={kmsGuides} />;
}
