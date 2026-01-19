import { useTranslation } from 'react-i18next';

import { GuideItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_QUICK_START } from './guideQuickStart.constants';

export const useGuideItemQuickStart = (id: number): GuideItem => {
  const { t } = useTranslation('key-management-service/guide');
  const guideLink = useGuideLink(GUIDES_QUICK_START);
  const { trackClick } = useOkmsTracking();

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guides_header_quick_start'),
    onClick: () =>
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.externalLink,
        actionType: 'navigation',
        actions: ['guide-quick-start'],
      }),
  };
};
