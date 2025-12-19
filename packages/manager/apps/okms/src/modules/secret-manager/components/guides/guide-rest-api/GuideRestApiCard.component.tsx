import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card } from '@ovh-ux/manager-react-components';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_REST_API } from './guideRestApi.constants';

export const GuideRestApiCard = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ONBOARDING]);
  const guideLink = useGuideLink(GUIDES_REST_API);

  return (
    <Card
      href={guideLink}
      texts={{
        title: t('guide_use_with_rest_api'),
        description: t('guide_use_with_rest_api_description'),
        category: t('tutorial', { ns: NAMESPACES.ONBOARDING }),
      }}
      isExternalHref={true}
    />
  );
};
