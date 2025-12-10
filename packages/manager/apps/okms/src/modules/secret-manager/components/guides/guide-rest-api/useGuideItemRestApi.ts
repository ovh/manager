import { useTranslation } from 'react-i18next';

import { GuideItem } from '@ovh-ux/manager-react-components';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_REST_API } from './guideRestApi.constants';

export const useGuideItemRestApi = (id: number): GuideItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_REST_API);

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guide_use_with_rest_api'),
  };
};
