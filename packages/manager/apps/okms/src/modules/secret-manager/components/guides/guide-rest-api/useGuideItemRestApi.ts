import { useTranslation } from 'react-i18next';

import { GuideMenuItem } from '@ovh-ux/muk';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_REST_API } from './guideRestApi.constants';

export const useGuideItemRestApi = (id: number): GuideMenuItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_REST_API);

  return {
    id,
    href: guideLink,
    target: '_blank',
    children: t('guide_use_with_rest_api'),
  };
};
