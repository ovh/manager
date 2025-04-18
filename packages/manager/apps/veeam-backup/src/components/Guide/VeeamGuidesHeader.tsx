import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GuideButton, GuideItem } from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

export default function VeeamGuidesHeader() {
  const { t } = useTranslation('veeam-backup');
  const guideLinks = useGuideUtils();

  const veeamGuides: GuideItem[] = useMemo(
    () => [
      {
        id: 1,
        href: guideLinks?.quickStart,
        target: '_blank',
        label: t('guides_header_veeam_quick_start'),
        dataTestid: 'guides_header_veeam_quick_start',
      },
      {
        id: 2,
        href: guideLinks?.usage,
        target: '_blank',
        label: t('guides_header_veeam_usage'),
        dataTestid: 'guides_header_veeam_usage',
      },
      {
        id: 3,
        href: guideLinks?.faq,
        target: '_blank',
        label: t('guides_header_veeam_faq'),
        dataTestid: 'guides_header_veeam_faq',
      },
    ],
    [guideLinks],
  );

  return <GuideButton items={veeamGuides} />;
}
