import {
  useVcdDatacentre,
  useVcdEdgeGatewaysMocks,
} from '@ovh-ux/manager-module-vcd-api';
import {
  Datagrid,
  ErrorBanner,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Outlet, useParams } from 'react-router-dom';
import { Suspense } from 'react';
import { urls } from '@/routes/routes.constant';
import { EDGE_GATEWAY_LABEL } from '../datacentreDashboard.constants';
import Loading from '@/components/loading/Loading.component';
import { useEdgeGatewayListingColumns } from './hooks/useEdgeGatewayListingColumns';
import { EdgeGatewayOrderButton } from './components/EdgeGatewayOrderButton.component';
import { isEdgeCompatibleVDC } from '@/utils/edgeGatewayCompatibility';
import { EDGE_GATEWAY_MAX_QUANTITY } from './datacentreEdgeGateway.constants';

export default function EdgeGatewayListingPage() {
  const { id, vdcId } = useParams();
  const columns = useEdgeGatewayListingColumns();
  const vdcQuery = useVcdDatacentre(id, vdcId);
  const edgeQuery = useVcdEdgeGatewaysMocks(id, vdcId);

  const queryList = [vdcQuery, edgeQuery];
  const queries = {
    isLoading: queryList.some((q) => q.isLoading),
    isError: queryList.some((q) => q.isError),
    error: queryList.find((q) => q.isError)?.error?.message ?? null,
    data: { vdc: vdcQuery?.data?.data, edges: edgeQuery?.data },
  };
  const hasMaxEdges = queries.data?.edges?.length >= EDGE_GATEWAY_MAX_QUANTITY;

  if (queries.isLoading) return <Loading />;
  if (queries.isError) {
    return (
      <ErrorBanner error={{ status: 404, data: { message: queries.error } }} />
    );
  }

  return (
    <RedirectionGuard
      isLoading={queries.isLoading}
      route={urls.listing}
      condition={isEdgeCompatibleVDC(queries.data.vdc)}
    >
      <Suspense fallback={<Loading />}>
        <section className="px-10 flex flex-col">
          <OdsText preset="heading-3">{EDGE_GATEWAY_LABEL}</OdsText>
          <EdgeGatewayOrderButton
            className="mt-4 mb-8"
            isOrderDisabled={hasMaxEdges}
          />
          <Datagrid
            columns={columns}
            items={queries.data.edges}
            totalItems={queries.data.edges?.length}
          />
        </section>
      </Suspense>
      <Outlet />
    </RedirectionGuard>
  );
}
