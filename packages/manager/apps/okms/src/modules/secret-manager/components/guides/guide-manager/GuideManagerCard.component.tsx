import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkCard } from '@ovh-ux/muk';

import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import { GUIDES_MANAGER } from './guideManager.constants';

export const GuideManagerCard = () => {
  const { t } = useTranslation(['secret-manager', NAMESPACES.ONBOARDING]);
  const guideLink = useGuideLink(GUIDES_MANAGER);

  return (
    <LinkCard
      data-testid="guide-manager-card"
      href={guideLink}
      texts={{
        title: t('guide_use_in_manager'),
        description: t('guide_use_in_manager_description'),
        category: t('tutorial', { ns: NAMESPACES.ONBOARDING }),
      }}
      externalHref={true}
    />
  );
};
