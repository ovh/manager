import { BaseLayout, Breadcrumb } from '@ovh-ux/muk';

import { AppConfig, appName } from '@/App.constants';
import { ObservabilityServiceProvider } from '@/contexts/ObservabilityService.context';
import TenantsOutlet from '@/pages/tenants/Tenants.outlet';
import { LABELS } from '@/utils/labels.constants';

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
