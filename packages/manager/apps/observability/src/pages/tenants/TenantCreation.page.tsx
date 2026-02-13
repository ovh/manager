import MetricsCreationGuard from '@/components/metrics/creation-guard/MetricsCreationGuard.component';
import { TenantForm } from '@/pages/tenants/TenantForm.component';
import { urls } from '@/routes/Routes.constants';

export default function TenantCreationPage() {
  return (
    <MetricsCreationGuard route={urls.tenants}>
      <TenantForm />
    </MetricsCreationGuard>
  );
}
