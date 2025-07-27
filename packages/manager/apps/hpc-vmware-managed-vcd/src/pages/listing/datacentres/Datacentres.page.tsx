import {
  DataGridTextCell,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import {
  getVcdDatacentreListQueryKey,
  getVcdDatacentresRoute,
  VCDDatacentre,
} from '@ovh-ux/manager-module-vcd-api';
import {
  useOvhTracking,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import DatagridContainer, {
  TDatagridContainerProps,
} from '@/components/datagrid/container/DatagridContainer.component';
import { subRoutes, urls } from '@/routes/routes.constant';
import { capitalize } from '@/utils/capitalize';
import { ID_LABEL, VRACK_LABEL } from '@/pages/dashboard/dashboard.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { VIRTUAL_DATACENTERS_LABEL } from '@/pages/dashboard/organization/organizationDashboard.constants';
import { VRACK_PATH, DEDICATED_PATH } from './Datacentres.constants';
import { FEATURE_FLAGS } from '@/app.constants';

/* ========= datagrid cells ========= */
const DatagridIdCell = (vcdDatacentre: VCDDatacentre) => {
  const { id } = useParams();
  const datacentreDashboardHref = useHref(
    urls.datacentreDashboard
      .replace(subRoutes.dashboard, id)
      .replace(subRoutes.vdcId, vcdDatacentre.id),
  );
  const { trackClick } = useOvhTracking();

  return (
    <DataGridTextCell>
      <Links
        onClickReturn={() => {
          trackClick(TRACKING.datacentreListing.details);
        }}
        href={datacentreDashboardHref}
        label={vcdDatacentre.currentState.name}
        data-testid={TEST_IDS.listingDatacentreNameLink}
      />
    </DataGridTextCell>
  );
};

const DatagridDescriptionCell = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.description}</DataGridTextCell>
);

const DatagridCpuCountCell = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>{vcdDatacentre.currentState?.vCPUCount}</DataGridTextCell>
);

const DatagridCpuSpeedCell = (vcdDatacentre: VCDDatacentre) => {
  const { t } = useTranslation('datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_vcpu_value', {
        speed: vcdDatacentre.currentState?.vCPUSpeed,
      })}
    </DataGridTextCell>
  );
};

const DatagridRamCountCell = (vcdDatacentre: VCDDatacentre) => {
  const { t } = useTranslation('datacentres');

  return (
    <DataGridTextCell>
      {t('managed_vcd_vdc_quota_value', {
        quota: vcdDatacentre.currentState?.memoryQuota,
      })}
    </DataGridTextCell>
  );
};

const DatagridCommercialRange = (vcdDatacentre: VCDDatacentre) => (
  <DataGridTextCell>
    {capitalize(vcdDatacentre.currentState?.commercialRange)}
  </DataGridTextCell>
);

const DatagridVrackCell = (vcdDatacentre: VCDDatacentre) => {
  const { data: url } = useNavigationGetUrl([
    DEDICATED_PATH,
    `/${VRACK_PATH}/${vcdDatacentre.currentState?.vrack}`,
    {},
  ]);

  return (
    <DataGridTextCell>
      {vcdDatacentre.currentState?.vrack ? (
        <Links
          href={url as string}
          target="_blank"
          type={LinkType.external}
          label={vcdDatacentre.currentState.vrack}
        ></Links>
      ) : (
        ''
      )}
    </DataGridTextCell>
  );
};
/* ======= listing page ======== */
export default function DatacentresListing() {
  const { t } = useTranslation('listing');
  const { t: tVdc } = useTranslation('datacentres');
  const { id } = useParams();
  const { data: featuresAvailable } = useFeatureAvailability([
    FEATURE_FLAGS.VRACK,
  ]);
  const isVrackFeatureAvailable = featuresAvailable?.[FEATURE_FLAGS.VRACK];

  const columns = [
    {
      id: 'id',
      cell: DatagridIdCell,
      label: ID_LABEL,
    },
    {
      id: 'description',
      cell: DatagridDescriptionCell,
      label: t('managed_vcd_listing_description'),
    },
    {
      id: 'commercialRange',
      cell: DatagridCommercialRange,
      label: tVdc('managed_vcd_vdc_commercial_range'),
    },
    {
      id: 'cpuCount',
      cell: DatagridCpuCountCell,
      label: tVdc('managed_vcd_vdc_vcpu_count'),
    },
    {
      id: 'ramCount',
      cell: DatagridRamCountCell,
      label: tVdc('managed_vcd_vdc_ram_count'),
    },
    {
      id: 'vCpuSpeed',
      cell: DatagridCpuSpeedCell,
      label: tVdc('managed_vcd_vdc_vcpu_speed'),
    },
    isVrackFeatureAvailable && {
      id: 'vRack',
      cell: DatagridVrackCell,
      label: VRACK_LABEL,
    },
  ].filter(Boolean);

  const datagridProps: TDatagridContainerProps = {
    title: VIRTUAL_DATACENTERS_LABEL,
    queryKey: getVcdDatacentreListQueryKey(id),
    isEmbedded: true,
    route: {
      api: getVcdDatacentresRoute(id),
      onboarding: urls.onboarding,
    },
    columns,
  };

  return <DatagridContainer {...datagridProps} />;
}
