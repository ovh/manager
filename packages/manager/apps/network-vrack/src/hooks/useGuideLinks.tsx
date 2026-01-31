import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { GuideMenuItem } from '@ovh-ux/muk';

import { GUIDE_LINKS } from '@/utils/constants';

import { useGetUser } from './useGetUser';

type GuideLinksForSubsidiary = {
  link1: string;
  link2: string;
  link3?: string;
  link4?: string;
};

export const useGuideLinks = () => {
  const { t } = useTranslation('dashboard');
  const { user } = useGetUser();

  const guideItems = useMemo<GuideMenuItem[]>(() => {
    if (!user?.ovhSubsidiary) {
      return [];
    }

    const subsidiary = user.ovhSubsidiary as keyof typeof GUIDE_LINKS;
    const guideLinks: GuideLinksForSubsidiary = GUIDE_LINKS[subsidiary] || GUIDE_LINKS.DEFAULT;
    const isUS = subsidiary === 'US';

    const items: GuideMenuItem[] = [
      {
        id: 1,
        href: guideLinks.link1,
        target: '_blank',
        children: t('dashboard_guideLink1'),
      },
      {
        id: 2,
        href: guideLinks.link2,
        target: '_blank',
        children: t('dashboard_guideLink2'),
      },
    ];

    if (!isUS && guideLinks.link3) {
      items.push({
        id: 3,
        href: guideLinks.link3,
        target: '_blank',
        children: t('dashboard_guideLink3'),
      });
    }

    if (guideLinks.link4) {
      items.push({
        id: 4,
        href: guideLinks.link4,
        target: '_blank',
        children: t('dashboard_guideLink4'),
      });
    }
    return items;
  }, [user?.ovhSubsidiary, t]);

  return guideItems;
};
