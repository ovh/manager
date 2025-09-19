import { useTranslation } from 'react-i18next';

import {
  BaseLayout,
  Breadcrumb,  
} from '@ovh-ux/manager-react-components';
import { AppConfig, appName } from '@/App.constants';
import { Outlet } from 'react-router-dom';

export default function MetricsPage() {
  const { t } = useTranslation(['common', 'metrics']);

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} />}
      header={{ title: t('metrics:title') }}
    >      
      <Outlet />
    </BaseLayout>
  );
}
