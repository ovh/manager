import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BaseLayout } from '@ovh-ux/muk';

export default function OnboardingServiceLayout() {
  const { t } = useTranslation('tenants');
  return (
    <BaseLayout header={{ title: t('listing.title') }}>
      <Outlet />
    </BaseLayout>
  );
}
