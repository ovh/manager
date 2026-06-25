import { Suspense } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import Loading from '@/components/loading/Loading.component';
import { useVcdaStatus } from '@/data/hooks/vcda/useVcdaStatus.hook';
import { urls } from '@/routes/routes.constant';
import { MigrationProvider } from '../Migration.context';
import EndpointSection from './EndpointSection.component';
import WhitelistSection from './WhitelistSection.component';

export default function MigrationContent() {
  const { id } = useParams();
  const { data: status, isPending, isError } = useVcdaStatus(id ?? '');

  if (isPending) {
    return <Loading />;
  }

  // R4: the Migration tab exists only for a provisioned migration. A deep-link
  // while the org is definitively inactive / provisioning / deleting redirects to
  // the Dashboard. On a fetch error we do NOT redirect — the content below renders
  // its own error + retry affordance (R14).
  if (!isError && (!status || status.kind !== 'active')) {
    return <Navigate to={urls.dashboard.replace(':id', id ?? '')} replace />;
  }

  return (
    <Suspense>
      <MigrationProvider>
        <EndpointSection />
        <WhitelistSection />
        <Outlet />
      </MigrationProvider>
    </Suspense>
  );
}
