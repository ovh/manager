import { useTranslation } from 'react-i18next';

import { GuideMenuItem } from '@ovh-ux/muk';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_KV2 } from './guideKv2.constants';

export const useGuideItemKv2Api = (id: number): GuideMenuItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_KV2);

  return {
    id,
    href: guideLink,
    target: '_blank',
    children: t('guide_use_with_kv2_api'),
  };
};
