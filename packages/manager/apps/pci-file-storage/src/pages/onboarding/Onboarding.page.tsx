import { Navigate, useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { getOnboardingLinkFor } from '@/constants/Guides.constants';
import { useShares } from '@/data/hooks/shares/useShares';
import { useGetUser } from '@/hooks/useGetUser';
import { selectHasShares } from '@/pages/list/view-model/shareList.view-model';
import { subRoutes } from '@/routes/Routes.constants';

import { getRegionGuides } from './viewmodel/onboarding.view-model';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', 'guides', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { ovhSubsidiary } = useGetUser();
  const { region } = useEnvironment();
  const navigate = useNavigate();
  const { data: hasShares, isLoading } = useShares({ select: selectHasShares });

  if (!isLoading && hasShares) {
    return <Navigate to={`../${subRoutes.list}`} replace />;
  }

  const filteredGuides = getRegionGuides(region);

  return (
    <BaseLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={t('onboarding:title')}
        img={{
          src: 'assets/file-storage-icon.png',
          alt: '',
          className: 'w-[45px]',
        }}
        description={
          <Text className="text-center">
            <Trans className="block" i18nKey="onboarding:description" />
          </Text>
        }
        orderButtonLabel={t('onboarding:action-button')}
        onOrderButtonClick={() => navigate(`../${subRoutes.create}`)}
      >
        {filteredGuides.map((guide) => {
          return guide ? (
            <LinkCard
              key={guide.key}
              href={getOnboardingLinkFor(guide.links, ovhSubsidiary)}
              texts={{
                title: t(`guides:${guide.key}.title`),
                description: t(`guides:${guide.key}.description`),
                category: t(`guides:${guide.key}.category`),
              }}
              hrefLabel={t(`guides:${guide.key}.link-text`)}
              target="_blank"
            />
          ) : (
            /* Empty div are used to have the one-card layout centered (US case) */
            <div />
          );
        })}
      </OnboardingLayout>
    </BaseLayout>
  );
}
