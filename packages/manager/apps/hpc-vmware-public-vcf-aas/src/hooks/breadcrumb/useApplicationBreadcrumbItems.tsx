import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useVcdDatacentre, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';

import { VRACK_LABEL } from '@/pages/dashboard/dashboard.constants';
import { VHOSTS_LABEL } from '@/pages/dashboard/datacentre/compute/datacentreCompute.constants';
import { STORAGE_LABEL } from '@/pages/dashboard/datacentre/datacentreDashboard.constants';
import { VIRTUAL_DATACENTERS_LABEL } from '@/pages/dashboard/organization/organizationDashboard.constants';
import { subRoutes } from '@/routes/routes.constant';

import { useOrganisationParams } from '../params/useSafeParams';
import { BreadcrumbItem } from './useBreadcrumb';

export const useApplicationBreadcrumbItems = () => {
  const { t } = useTranslation([
    'dashboard',
    'datacentres/compute',
    'datacentres/storage',
    'datacentres/vrack-segment',
    NAMESPACES.ACTIONS,
  ]);
  const { id } = useOrganisationParams();
  const { vdcId } = useParams();
  const { data: vcdOrganization } = useVcdOrganization({ id });
  const { data: vcdDatacentre } = useVcdDatacentre(id, vdcId ?? '');

  const orgServiceName = vcdOrganization?.data?.currentState?.fullName ?? id;
  const vdcServiceName = vcdDatacentre?.data?.currentState?.description ?? vdcId;

  const breadcrumbLabels = {
    [id]: orgServiceName,
    [subRoutes.editName]: t('managed_vcd_dashboard_edit_name_modal_title'),
    [subRoutes.editDescription]: t('managed_vcd_dashboard_edit_description_modal_title'),
    [subRoutes.terminate]: t(`${NAMESPACES.ACTIONS}:terminate`),
    [subRoutes.virtualDatacenters]: VIRTUAL_DATACENTERS_LABEL,
    ...(vdcId ? { [vdcId]: vdcServiceName } : {}),
    [subRoutes.datacentreCompute]: VHOSTS_LABEL,
    [subRoutes.datacentreComputeOrder]: t('datacentres/compute:managed_vcd_vdc_compute_order_cta'),
    [subRoutes.datacentreStorage]: STORAGE_LABEL,
    [subRoutes.datacentreStorageOrder]: t('datacentres/storage:managed_vcd_vdc_storage_order_cta'),
    [subRoutes.vrackSegments]: VRACK_LABEL,
    [subRoutes.vrackEditVlanId]: t(
      'datacentres/vrack-segment:managed_vcd_dashboard_vrack_edit_vlan',
    ),
    [subRoutes.deleteSegment]: t(
      'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_segment',
    ),
    [subRoutes.deleteNetwork]: t(
      'datacentres/vrack-segment:managed_vcd_dashboard_vrack_delete_network',
    ),
    [subRoutes.addNetwork]: t('datacentres/vrack-segment:managed_vcd_dashboard_vrack_add_network'),
  } as const;

  const breadcrumbItems: BreadcrumbItem[] = Object.entries(breadcrumbLabels).map(
    ([key, value]) => ({
      id: key,
      label: value,
    }),
  );

  return { items: breadcrumbItems };
};
