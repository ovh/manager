import { Text } from '@ovhcloud/ods-react';

import { OnboardingLayout } from '@ovh-ux/muk';

import { OkmsDomainTopZone } from '../../components/domain-top-zone/OkmsDomainTopZone.component';

export default function ServiceKeysOnboardingPage() {
  return (
    <div className="flex flex-col gap-6">
      <OkmsDomainTopZone />
      <OnboardingLayout
        title="Service Keys"
        description={
          <div className="flex flex-col gap-2">
            <Text className="text-center">
              Please select or create an OKMS domain to manage service keys.
            </Text>
          </div>
        }
      ></OnboardingLayout>
    </div>
  );
}
