import GrafanaButton from '@/components/metrics/grafana-button/GrafanaButton.component';
import ServicesNavigation from '@/components/services/navigation/ServicesNavigation.component';
import { urls } from '@/routes/Routes.constants';

const TenantsOutlet = () => (
  <ServicesNavigation button={<GrafanaButton />} rootUrl={urls.tenants} />
);

export default TenantsOutlet;
