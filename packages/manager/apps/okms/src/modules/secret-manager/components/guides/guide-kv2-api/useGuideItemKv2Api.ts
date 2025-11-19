import { useTranslation } from 'react-i18next';

import { GuideItem } from '@ovh-ux/manager-react-components';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_KV2 } from './guideKv2.constants';

export const useGuideItemKv2Api = (id: number): GuideItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_KV2);

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guide_use_with_kv2_api'),
  };
};
