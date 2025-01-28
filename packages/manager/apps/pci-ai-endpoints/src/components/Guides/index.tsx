import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import { GuideButton } from '@ovh-ux/manager-react-components';
import useGuideUtils from '@/hooks/guide/useGuideUtils';

export default function EndpointsGuideHeader() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();

  const endpointsGuides = [
    {
      id: 1,
      href: link?.guideLink1,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('ai_endpoints_guide1Title'),
    },
    {
      id: 2,
      href: link?.guideLink2,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('ai_endpoints_guide2Title'),
    },
    {
      id: 3,
      href: link?.tutoLink1,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('ai_endpoints_guide3Title'),
    },
  ];

  return (
    <Suspense fallback={<OsdsSkeleton inline randomized />}>
      <GuideButton items={endpointsGuides} />
    </Suspense>
  );
}
