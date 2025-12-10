import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card } from '@ovh-ux/manager-react-components';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_KV2 } from './guideKv2.constants';

export const GuideKv2Card = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ONBOARDING]);
  const guideLink = useGuideLink(GUIDES_KV2);

  return (
    <Card
      href={guideLink}
      texts={{
        title: t('guide_use_with_kv2_api'),
        description: t('guide_use_with_kv2_api_description'),
        category: t('tutorial', { ns: NAMESPACES.ONBOARDING }),
      }}
      isExternalHref={true}
    />
  );
};
