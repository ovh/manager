import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';

import { AppConfig, appName } from '@/App.constants';
import { ObservabilityServiceProvider } from '@/contexts/ObservabilityService.context';
import { LABELS } from '@/utils/labels.constants';

import TenantsOutlet from './Tenants.outlet';

export default function TenantsLayout() {
  return (
    <BaseLayout
      breadcrumb={<Breadcrumb appName={appName} rootLabel={AppConfig.rootLabel} />}
      header={{ title: LABELS.TENANTS }}
    >
      <ObservabilityServiceProvider>
        <TenantsOutlet />
      </ObservabilityServiceProvider>
    </BaseLayout>
  );
}
