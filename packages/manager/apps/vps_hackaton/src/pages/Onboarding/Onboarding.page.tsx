import { useTranslation } from 'react-i18next';
import { Button, Text } from '@ovhcloud/ods-react';

export const OnboardingPage = () => {
  const { t } = useTranslation('vps');

  const handleOrderClick = () => {
    window.open('https://www.ovhcloud.com/fr/vps/', '_blank');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <Text preset="heading-1" className="mb-4">
          {t('vps_onboarding_title')}
        </Text>
        <Text preset="paragraph" className="mb-8 text-gray-600">
          {t('vps_onboarding_description')}
        </Text>
        <Button
          variant="default"
          label={t('vps_onboarding_order_button')}
          onClick={handleOrderClick}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
