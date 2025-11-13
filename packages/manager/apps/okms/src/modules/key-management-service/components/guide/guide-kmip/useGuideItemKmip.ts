import { GuideItem } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { GUIDES_KMIP } from './guideKmip.constants';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

export const useGuideItemKmip = (id: number): GuideItem => {
  const { t } = useTranslation('key-management-service/guide');
  const guideLink = useGuideLink(GUIDES_KMIP);
  const { trackClick } = useOvhTracking();

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
        actions: ['connect-product-kmip'],
      }),
  };
};
