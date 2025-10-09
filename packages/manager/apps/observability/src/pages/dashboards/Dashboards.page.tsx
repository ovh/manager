import { useTranslation } from 'react-i18next';

import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';

import { AppConfig, appName } from '@/App.constants';

export default function ListingPage() {
  const { t } = useTranslation(['common', 'dashboards']);

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} />}
      header={{ title: t('dashboards:title') }}
    ></BaseLayout>
  );
}
