import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { VCDOrganization, isStatusTerminated } from '@ovh-ux/manager-module-vcd-api';
import {
  Clipboard,
  DashboardTile,
  LinkType,
  Links,
  Region,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { subRoutes } from '@/routes/routes.constant';
import { TRACKING } from '@/tracking.constants';
import { iamActions } from '@/utils/iam.constants';
import TEST_IDS from '@/utils/testIds.constants';

import EditableTileItem from '../editable-tile-item/EditableTileItem.component';
import DatacentresCount from './DatacentresCount.component';

type TTileProps = {
  vcdOrganization: VCDOrganization;
};

export default function OrganizationGenerationInformationTile({ vcdOrganization }: TTileProps) {
  const { t } = useTranslation('dashboard');
  const { t: tDashboard } = useTranslation(NAMESPACES.DASHBOARD);
  const { t: tRegion } = useTranslation(NAMESPACES.REGION);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const isDisabled = isStatusTerminated(vcdOrganization.resourceStatus);

  return (
    <DashboardTile
      title={tDashboard('general_information')}
      items={[
        {
          id: 'name',
          label: tDashboard('name'),
          value: (
            <EditableTileItem
              value={vcdOrganization.currentState?.fullName}
              name="vcdName"
              urn={vcdOrganization.iam?.urn}
              iamActions={[iamActions.vmwareCloudDirectorApiovhOrganizationEdit]}
              isDisabled={isDisabled}
              onClickEdit={() => navigate(subRoutes.editName)}
            />
          ),
        },
        {
          id: 'description',
          label: tDashboard('description'),
          value: (
            <EditableTileItem
              value={vcdOrganization.currentState?.description}
              name="vcdDescription"
              urn={vcdOrganization.iam.urn}
              iamActions={[iamActions.vmwareCloudDirectorApiovhOrganizationEdit]}
              isDisabled={isDisabled}
              onClickEdit={() => navigate(subRoutes.editDescription)}
            />
          ),
        },
        {
          id: 'location',
          label: tRegion('localisation'),
          value: (
            <OdsText>
              <Region name={vcdOrganization.currentState?.region?.toLowerCase()} mode="region" />
            </OdsText>
          ),
        },
        {
          id: 'region',
          label: tRegion('region'),
          value: <OdsText>{vcdOrganization?.currentState?.region?.toLowerCase()}</OdsText>,
        },
        {
          id: 'datacentresCount',
          label: t('managed_vcd_dashboard_datacentres_count'),
          value: <DatacentresCount />,
        },
        {
          id: 'interface',
          label: t('managed_vcd_dashboard_management_interface'),
          value: (
            <Links
              type={LinkType.external}
              href={vcdOrganization.currentState?.webInterfaceUrl}
              label={t('managed_vcd_dashboard_management_interface_access')}
              target="_blank"
              data-testid={TEST_IDS.dashboardVcdInterfaceLink}
              onClickReturn={() => trackClick(TRACKING.dashboard.goToVcdPortal)}
            />
          ),
        },
        {
          id: 'apiUrl',
          label: t('managed_vcd_dashboard_api_url'),
          value: <Clipboard value={vcdOrganization.currentState?.apiUrl} className="w-full" />,
        },
      ]}
    />
  );
}
