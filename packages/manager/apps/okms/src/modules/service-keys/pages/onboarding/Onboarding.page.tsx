import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { OnboardingLayout } from '@ovh-ux/muk';

import { OkmsDomainTopZone } from '../../components/domain-top-zone/OkmsDomainTopZone.component';

export default function ServiceKeysOnboardingPage() {
  const { t } = useTranslation(['service-keys', 'key-management-service/serviceKeys']);

  return (
    <div className="flex flex-col gap-6">
      <OkmsDomainTopZone />
      <OnboardingLayout
        title={t('service-keys:service_keys', { defaultValue: 'Service Keys' })}
        description={
          <div className="flex flex-col gap-2">
            <Text className="text-center">
              {t('service-keys:onboarding_description', {
                defaultValue: 'Please select or create an OKMS domain to manage service keys.',
              })}
            </Text>
          </div>
        }
      ></OnboardingLayout>
    </div>
  );
}
