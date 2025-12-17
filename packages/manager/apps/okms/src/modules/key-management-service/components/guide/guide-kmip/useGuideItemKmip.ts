import { useTranslation } from 'react-i18next';

import { GuideItem } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_KMIP } from './guideKmip.constants';

export const useGuideItemKmip = (id: number): GuideItem => {
  const { t } = useTranslation('key-management-service/guide');
  const guideLink = useGuideLink(GUIDES_KMIP);
  const { trackClick } = useOkmsTracking();

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guides_header_connect_kmip_product'),
    onClick: () =>
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.externalLink,
        actionType: 'navigation',
        actions: ['guide-kmip'],
      }),
  };
};
