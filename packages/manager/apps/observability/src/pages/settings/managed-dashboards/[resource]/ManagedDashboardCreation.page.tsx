import MetricsCreationGuard from '@/components/metrics/creation-guard/MetricsCreationGuard.component';
import ManagedDashboardForm from '@/pages/settings/managed-dashboards/[resource]/ManagedDashboardForm.component';
import { urls } from '@/routes/Routes.constants';

export default function ManagedDashboardCreationPage() {
  return (
    <MetricsCreationGuard route={urls.managedDashboards}>
      <ManagedDashboardForm />
    </MetricsCreationGuard>
  );
}
