import { GuideItem } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { GUIDES_USAGE } from './guideUsage.constants';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

export const useGuideItemUsage = (id: number): GuideItem => {
  const { t } = useTranslation('key-management-service/guide');
  const guideLink = useGuideLink(GUIDES_USAGE);
  const { trackClick } = useOvhTracking();

  return {
    id,
    href: guideLink,
    target: '_blank',
    label: t('guides_header_kms_usage'),
    onClick: () =>
      trackClick({
        location: PageLocation.page,
        buttonType: ButtonType.externalLink,
        actionType: 'navigation',
        actions: ['go-to-use-ovh-kms'],
      }),
  };
};
