import { useTranslation } from 'react-i18next';

import { GuideMenuItem } from '@ovh-ux/muk';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_MANAGER } from './guideManager.constants';

export const useGuideItemManager = (id: number): GuideMenuItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_MANAGER);

  return {
    id,
    href: guideLink,
    target: '_blank',
    children: t('guide_use_in_manager'),
  };
};
