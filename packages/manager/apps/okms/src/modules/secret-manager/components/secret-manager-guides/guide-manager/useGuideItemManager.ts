import { GuideItem } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { GUIDES_MANAGER } from './guideManager.constants';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

export const useGuideItemManager = (id: number): GuideItem => {
  const { t } = useTranslation('secret-manager');
  const guideLink = useGuideLink(GUIDES_MANAGER);

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guide_use_in_manager'),
  };
};
