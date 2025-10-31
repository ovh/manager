import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useVcdOrganization,
  useVcdDatacentre,
  getVcdDatacentreListQueryKey,
} from '@ovh-ux/manager-module-vcd-api';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import { BreadcrumbItem } from '@/hooks/breadcrumb/useBreadcrumb';
import VcdDashboardLayout, {
  DashboardTab,
} from '@/components/dashboard/layout/VcdDashboardLayout.component';
import {
  COMPUTE_LABEL,
  EDGE_GATEWAY_LABEL,
  STORAGE_LABEL,
} from './datacentreDashboard.constants';
import { subRoutes, urls } from '@/routes/routes.constant';
import { useAutoRefetch } from '@/data/hooks/useAutoRefetch';
import { isUpdatingTargetSpec } from '@/utils/refetchConditions';
import { CHANGELOG_LINKS } from '@/utils/changelog.constants';
import { TRACKING_TABS_ACTIONS } from '@/tracking.constants';
import { VIRTUAL_DATACENTERS_LABEL } from '../organization/organizationDashboard.constants';
import { VRACK_LABEL } from '../dashboard.constants';
import { FEATURE_FLAGS } from '@/app.constants';
import MessageSuspendedService from '@/components/message/MessageSuspendedService.component';
import { isEdgeCompatibleVDC } from '@/utils/edgeGatewayCompatibility';

function DatacentreDashboardPage() {
  const { id, vdcId } = useParams();
  const { t } = useTranslation(['dashboard', 'datacentres/edge-gateway']);
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId);
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const { data: featuresAvailable } = useFeatureAvailability([
    FEATURE_FLAGS.VRACK,
  ]);
  const isVrackFeatureAvailable = featuresAvailable?.[FEATURE_FLAGS.VRACK];
  const navigate = useNavigate();

  useAutoRefetch({
    queryKey: getVcdDatacentreListQueryKey(id),
    enabled: isUpdatingTargetSpec(vcdDatacentre?.data),
    interval: 4000,
  });

  const tabsList: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('dashboard:managed_vcd_dashboard_general_information'),
      to: useResolvedPath('').pathname,
      trackingActions: TRACKING_TABS_ACTIONS.datacentres,
    },
    {
      name: 'compute',
      title: COMPUTE_LABEL,
      to: useResolvedPath(subRoutes.datacentreCompute).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.compute,
    },
    {
      name: 'storage',
      title: STORAGE_LABEL,
      to: useResolvedPath(subRoutes.datacentreStorage).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.storage,
    },
    {
      name: 'vrack-segments',
      title: VRACK_LABEL,
      to: useResolvedPath(subRoutes.vrackSegments).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.vrack,
      disabled:
        !isVrackFeatureAvailable || !vcdDatacentre?.data?.currentState?.vrack,
    },
    {
      name: 'edge-gateway',
      title: EDGE_GATEWAY_LABEL,
      to: useResolvedPath(subRoutes.edgeGateway).pathname,
      trackingActions: TRACKING_TABS_ACTIONS.edgeGateway,
      disabled: isEdgeCompatibleVDC(vcdDatacentre?.data), // TODO: [EDGE] inverse condition when unmocking (testing only)
    },
  ].filter(({ disabled }) => !disabled);

  const serviceName = vcdDatacentre?.data?.currentState?.description ?? vdcId;
  const hasServiceRenamed = vdcId !== serviceName;

  const header = hasServiceRenamed
    ? {
        description: vdcId,
        title: serviceName,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }
    : {
        title: vdcId,
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      };

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      id,
      label: vcdOrganization?.data?.currentState?.fullName,
    },
    {
      id: subRoutes.virtualDatacenters,
      label: VIRTUAL_DATACENTERS_LABEL,
    },
    {
      id: vdcId,
      label: serviceName,
    },
    {
      id: subRoutes.vrackSegments,
      label: VRACK_LABEL,
    },
    {
      id: subRoutes.edit,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_edit_vlan',
      ),
    },
    {
      id: subRoutes.deleteSegment,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_segment',
      ),
    },
    {
      id: subRoutes.deleteNetwork,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_network',
      ),
    },
    {
      id: subRoutes.addNetwork,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_segment_add_title',
      ),
    },
    {
      id: subRoutes.deleteSegment,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_segment',
      ),
    },
    {
      id: subRoutes.deleteNetwork,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_network',
      ),
    },
    {
      id: subRoutes.addNetwork,
      label: t(
        'datacentres/vrack-segment:managed_vcd_dashboard_vrack_segment_add_title',
      ),
    },
    {
      id: subRoutes.edgeGateway,
      label: EDGE_GATEWAY_LABEL,
    },
    {
      id: subRoutes.deleteEdgeGateway,
      label: t('datacentres/edge-gateway:edge_delete_title'),
    },
  ];

  return (
    <VcdDashboardLayout
      tabs={tabsList}
      breadcrumbItems={breadcrumbItems}
      header={header}
      message={
        <MessageSuspendedService status={vcdDatacentre?.data?.resourceStatus} />
      }
      backLinkLabel={t('dashboard:managed_vcd_dashboard_back_link')}
      onClickReturn={() =>
        navigate(urls.datacentres.replace(subRoutes.dashboard, id))
      }
    />
  );
}

export default DatacentreDashboardPage;
