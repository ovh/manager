import React from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';

import OnboardingDescription from '@/components/OnboardingDescription/OnboardingDescription.component';
import OnboardingHighlights from '@/components/OnboardingHighlights/OnboardingHighlights.component';
import { BACKUP_LICENSES_NAMESPACES, TUTORIAL_DOC_URL } from '@/module.constants';
import { stubRoutes } from '@/routes/routes.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.ONBOARDING);
  const navigate = useNavigate();

  return (
    <>
      <div className="mt-8 pt-6">
        <OnboardingLayout
          title={t('title')}
          img={{ alt: t('hero_alt') }}
          description={<OnboardingDescription />}
          orderButtonLabel={t('order_cta')}
          onOrderButtonClick={() => navigate(stubRoutes.orderFunnel)}
        />
        <div className="mx-auto max-w-[800px] mt-6 mb-6 sm:px-10">
          <OnboardingHighlights keys={['storage_included', 'pricing', 'compatibility']} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:px-10">
          <Card
            href={TUTORIAL_DOC_URL}
            isExternalHref
            hrefLabel={t('tutorial_card.cta')}
            texts={{
              category: t('tutorial_card.category'),
              title: t('tutorial_card.title'),
              description: t('tutorial_card.description'),
            }}
          />
        </div>
      </div>
    </>
  );
}
