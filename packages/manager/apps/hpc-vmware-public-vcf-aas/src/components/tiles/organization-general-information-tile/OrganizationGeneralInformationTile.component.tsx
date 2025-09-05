import {
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
  Region,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  isStatusTerminated,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { subRoutes } from '@/routes/routes.constant';
import { iamActions } from '@/utils/iam.constants';
import EditableTileItem from '../editable-tile-item/EditableTileItem.component';
import DatacentresCount from './DatacentresCount.component';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';

type TTileProps = {
  vcdOrganization: VCDOrganization;
};

export default function OrganizationGenerationInformationTile({
  vcdOrganization,
}: TTileProps) {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const isDisabled = isStatusTerminated(vcdOrganization.resourceStatus);

  return (
    <DashboardTile
      title={t('managed_vcd_dashboard_general_information')}
      items={[
        {
          id: 'name',
          label: t('managed_vcd_dashboard_name'),
          value: (
            <EditableTileItem
              value={vcdOrganization.currentState?.fullName}
              name="vcdName"
              urn={vcdOrganization.iam?.urn}
              iamActions={[
                iamActions.vmwareCloudDirectorApiovhOrganizationEdit,
              ]}
              isDisabled={isDisabled}
              onClickEdit={() => navigate(subRoutes.editName)}
            />
          ),
        },
        {
          id: 'description',
          label: t('managed_vcd_dashboard_description'),
          value: (
            <EditableTileItem
              value={vcdOrganization.currentState?.description}
              name="vcdDescription"
              urn={vcdOrganization.iam.urn}
              iamActions={[
                iamActions.vmwareCloudDirectorApiovhOrganizationEdit,
              ]}
              isDisabled={isDisabled}
              onClickEdit={() => navigate(subRoutes.editDescription)}
            />
          ),
        },
        {
          id: 'location',
          label: t('managed_vcd_dashboard_location'),
          value: (
            <OdsText>
              <Region
                name={vcdOrganization.currentState?.region?.toLowerCase()}
                mode="region"
              />
            </OdsText>
          ),
        },
        {
          id: 'region',
          label: t('managed_vcd_dashboard_region'),
          value: (
            <OdsText>
              {vcdOrganization?.currentState?.region?.toLowerCase()}
            </OdsText>
          ),
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
          value: (
            <Clipboard
              value={vcdOrganization.currentState?.apiUrl}
              className="w-full"
            />
          ),
        },
      ]}
    />
  );
}
