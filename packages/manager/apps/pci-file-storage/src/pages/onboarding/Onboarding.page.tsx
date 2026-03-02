import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Spinner, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { getOnboardingLinkFor } from '@/constants/Guides.constants';
import { useShareCreationPolling } from '@/data/hooks/operation/useShareCreationPolling';
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
  const { shareCreationsCount, isPending: isPendingShareCreation } = useShareCreationPolling();

  const hasSharesAndNoPendingCreations =
    !isLoading && hasShares && !isPendingShareCreation && !shareCreationsCount;

  useEffect(() => {
    if (hasSharesAndNoPendingCreations) {
      navigate(`../${subRoutes.list}`, { replace: true });
    }
  }, [hasSharesAndNoPendingCreations, navigate]);

  const isCreationPending = isPendingShareCreation || shareCreationsCount > 0;
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
          isCreationPending ? (
            <div className="mt-6 flex flex-col items-center">
              <Text preset="label" className="text-center">
                {t('onboarding:creationPending')}
              </Text>
              <div className="my-6">
                <Spinner size="md" />
              </div>
            </div>
          ) : (
            <Text className="text-center">
              <Trans className="block" i18nKey="onboarding:description" />
            </Text>
          )
        }
        orderButtonLabel={!isCreationPending ? t('onboarding:action-button') : undefined}
        onOrderButtonClick={
          !isCreationPending ? () => navigate(`../${subRoutes.create}`) : undefined
        }
      >
        {filteredGuides.map((guide) => (
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
        ))}
      </OnboardingLayout>
    </BaseLayout>
  );
}
