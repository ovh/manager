import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { GuideMenu, GuideMenuItem } from '@ovh-ux/muk';

import { useMetricsGuides } from '@/hooks/guide/useMetricsGuides.hook';

export default function MetricsGuideHeader() {
  const { t } = useTranslation(['metrics', NAMESPACES.ONBOARDING]);
  const guideLinks = useMetricsGuides();

  const items: GuideMenuItem[] = [
    {
      id: 1,
      href: guideLinks?.gettingStarted ?? '',
      target: '_blank',
      children: t('metrics:guide.getting_started'),
    },
    {
      id: 2,
      href: guideLinks?.documentation ?? '',
      target: '_blank',
      children: t('metrics:guide.documentation'),
    },
  ];

  return <GuideMenu items={items} />;
}
