import React from 'react';
import { useTranslation } from 'react-i18next';
import { GuideButton, GuideItem } from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

export default function VcdGuidesHeader() {
  const { t } = useTranslation('listing');
  const guideLinks = useGuideUtils();

  const guides: GuideItem[] = [
    {
      id: 1,
      href: guideLinks?.tutorial,
      target: '_blank',
      label: t('managed_vcd_listing_vcd_tutorial_guides'),
    },
    {
      id: 2,
      href: guideLinks?.fondamentals,
      target: '_blank',
      label: t('managed_vcd_listing_vcd_fondamentals_guides'),
    },
    {
      id: 3,
      href: guideLinks?.faq,
      target: '_blank',
      label: t('managed_vcd_listing_vcd_faq_guides'),
    },
  ];

  return <GuideButton items={guides} />;
}
