import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsButton } from '@ovhcloud/ods-components/react';
import onboardingImage from './onboarding.svg';
import { SMS_ROUTES_URLS } from '@/routes/routes.constants';
import { useOkmsList } from '@/data/hooks/useOkms';
import Loading from '@/components/Loading/Loading';

export default function SecretsOnboardingPage() {
  const { t } = useTranslation('secret-management-service/onboarding');
  const navigate = useNavigate();
  const { data, isPending } = useOkmsList({});
  const firstKmsId = data?.pages[0]?.data?.[0]?.id;
  const hasNavigated = useRef(false);

  // Redirect to the first KMS if there is one
  useLayoutEffect(() => {
    if (firstKmsId && !hasNavigated.current) {
      hasNavigated.current = true;
      // We use replace to avoid adding this navigation to the history stack
      navigate(SMS_ROUTES_URLS.secretListing(firstKmsId), { replace: true });
    }
  }, [firstKmsId, navigate]);

  if (isPending) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <OnboardingLayout
        title={t('title')}
        img={{ src: onboardingImage }}
        description={
          <div className="flex flex-col gap-2">
            <OdsText className="text-center">{t('description1')}</OdsText>
            <OdsText className="text-center">{t('description2')}</OdsText>
          </div>
        }
        orderButtonLabel={t('createButtonLabel')}
        onOrderButtonClick={() => navigate(SMS_ROUTES_URLS.secretCreate)}
      />
      <OdsButton
        label={t('createButtonLabel')}
        onClick={() => navigate(SMS_ROUTES_URLS.secretCreate)}
      />
    </Suspense>
  );
}
