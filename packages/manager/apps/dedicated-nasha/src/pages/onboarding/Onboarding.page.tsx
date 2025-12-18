import React, { useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OnboardingLayout, LinkCard, Text } from '@ovh-ux/muk';
import {
  GUIDES,
  PREFIX_TRACKING_ONBOARDING,
  PREFIX_TRACKING_ONBOARDING_GUIDES,
  NASHA_TITLE,
} from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';

export default function OnboardingPage() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();
  const { shell, environment } = useContext(ShellContext);
  const { tracking } = shell;

  // Get user subsidiary for localized guide links
  const ovhSubsidiary = environment?.getUser()?.ovhSubsidiary || 'WW';

  // Build localized guides
  const guides = useMemo(() => {
    return GUIDES.map((guide) => ({
      ...guide,
      title: t(`nasha_onboarding_${guide.id}_title`),
      description: t(`nasha_onboarding_${guide.id}_content`),
      link: guide.link[ovhSubsidiary as keyof typeof guide.link] || guide.link.WW,
    }));
  }, [t, ovhSubsidiary]);

  // Build description
  const description = useMemo(
    () => (
      <section className="text-center">
        <Text className="my-6 block">{t('nasha_onboarding_content')}</Text>
      </section>
    ),
    [t],
  );

  // Handle order button click
  const handleOrderClick = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_ONBOARDING}::add`,
      type: 'action',
    });
    navigate(urls.order);
  };

  // Handle guide click
  const handleGuideClick = (hitSuffix: string) => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_ONBOARDING_GUIDES}::${hitSuffix}`,
      type: 'action',
    });
  };

  return (
    <OnboardingLayout
      title={NASHA_TITLE}
      description={description}
      orderButtonLabel={t('nasha_onboarding_order')}
      onOrderButtonClick={handleOrderClick}
      moreInfoButtonLabel={t('nasha_onboarding_more_info')}
    >
      {guides.map((guide) => (
        <LinkCard
          key={guide.id}
          href={guide.link}
          onClick={() => handleGuideClick(guide.hitSuffix)}
          texts={{
            title: guide.title,
            description: guide.description,
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
