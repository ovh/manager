import {
  LinkType,
  Links,
  Clipboard,
  DashboardTile,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  isStatusTerminated,
  VCDDatacentre,
  VCDOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  useOvhTracking,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { subRoutes } from '@/routes/routes.constant';
import { iamActions } from '@/utils/iam.constants';
import EditableTileItem from '../editable-tile-item/EditableTileItem.component';
import {
  VRACK_PATH,
  DEDICATED_PATH,
  VRACK_ONBOARDING_PATH,
} from '../../../pages/listing/datacentres/Datacentres.constants';

import { capitalize } from '@/utils/capitalize';
import { ID_LABEL, VRACK_LABEL } from '@/pages/dashboard/dashboard.constants';
import TEST_IDS from '@/utils/testIds.constants';
import { TRACKING } from '@/tracking.constants';
import { FEATURE_FLAGS } from '@/app.constants';

type TTileProps = {
  vcdDatacentre: VCDDatacentre;
  vcdOrganization: VCDOrganization;
};

export default function DatacentreGenerationInformationTile({
  vcdDatacentre,
  vcdOrganization,
}: TTileProps) {
  const { t } = useTranslation('dashboard');
  const { t: tVdc } = useTranslation('datacentres');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { data: featuresAvailable } = useFeatureAvailability([
    FEATURE_FLAGS.VRACK,
    FEATURE_FLAGS.VRACK_ASSOCIATION,
  ]);
  const isVrackFeatureAvailable = featuresAvailable?.[FEATURE_FLAGS.VRACK];
  const isVrackAssociationFeatureAvailable =
    featuresAvailable?.[FEATURE_FLAGS.VRACK_ASSOCIATION];
  const canBeAssociatedWithVrack = !vcdDatacentre?.currentState?.vrack;

  const { data: urlVrack } = useNavigationGetUrl([
    DEDICATED_PATH,
    `/${VRACK_PATH}/${vcdDatacentre.currentState?.vrack ||
      VRACK_ONBOARDING_PATH}`,
    {},
  ]);

  return (
    <DashboardTile
      title={t('managed_vcd_dashboard_general_information')}
      items={[
        {
          id: 'description',
          label: t('managed_vcd_dashboard_description'),
          value: (
            <EditableTileItem
              value={vcdDatacentre?.currentState?.description}
              name="vdcDescription"
              iamActions={[
                iamActions.vmwareCloudDirectorApiovhOrganizationVirtualDataCenterEdit,
              ]}
              urn={vcdDatacentre?.iam?.urn}
              onClickEdit={() => navigate(subRoutes.editDescription)}
              isDisabled={isStatusTerminated(vcdOrganization.resourceStatus)}
            />
          ),
        },
        {
          id: 'commercialRange',
          label: tVdc('managed_vcd_vdc_commercial_range'),
          value: (
            <OdsText>
              {capitalize(vcdDatacentre?.currentState?.commercialRange)}
            </OdsText>
          ),
        },
        {
          id: 'cpuCount',
          label: tVdc('managed_vcd_vdc_vcpu_count'),
          value: (
            <OdsText>
              {vcdDatacentre?.currentState.vCPUCount?.toString()}
            </OdsText>
          ),
        },
        {
          id: 'ramCount',
          label: tVdc('managed_vcd_vdc_ram_count'),
          value: (
            <OdsText>
              {tVdc('managed_vcd_vdc_quota_value', {
                quota: vcdDatacentre?.currentState?.memoryQuota,
              })}
            </OdsText>
          ),
        },
        {
          id: 'vcpuSpeed',
          label: tVdc('managed_vcd_vdc_vcpu_speed'),
          value: (
            <OdsText>
              {tVdc('managed_vcd_vdc_vcpu_value', {
                speed: vcdDatacentre?.currentState.vCPUSpeed,
              })}
            </OdsText>
          ),
        },
        {
          id: 'interface',
          label: t('managed_vcd_dashboard_management_interface'),
          value: (
            <Links
              type={LinkType.external}
              href={vcdOrganization?.currentState?.webInterfaceUrl}
              label={t('managed_vcd_dashboard_management_interface_access')}
              target="_blank"
              data-testid={TEST_IDS.dashboardDatacentreInterfaceLink}
              onClickReturn={() =>
                trackClick(TRACKING.datacentreDashboard.goToVcdPortal)
              }
            />
          ),
        },
        isVrackFeatureAvailable && {
          id: 'vRack',
          label: VRACK_LABEL,
          value: (
            <>
              <Links
                id={`vrack-${vcdDatacentre.id}`}
                aria-labelledby={
                  !isVrackAssociationFeatureAvailable &&
                  canBeAssociatedWithVrack
                    ? `vrack-${vcdDatacentre.id}-tooltip`
                    : undefined
                }
                href={urlVrack as string}
                type={LinkType.next}
                isDisabled={
                  !isVrackAssociationFeatureAvailable &&
                  canBeAssociatedWithVrack
                }
                label={
                  vcdDatacentre.currentState?.vrack ||
                  tVdc('managed_vcd_vdc_associate_vrack')
                }
              />
              {!isVrackAssociationFeatureAvailable && canBeAssociatedWithVrack && (
                <OdsTooltip
                  id={`vrack-${vcdDatacentre.id}-tooltip`}
                  triggerId={`vrack-${vcdDatacentre.id}`}
                  with-arrow
                >
                  {tVdc('managed_vcd_vdc_associate_vrack_disabled')}
                </OdsTooltip>
              )}
            </>
          ),
        },
        {
          id: 'apiUrl',
          label: t('managed_vcd_dashboard_api_url'),
          value: (
            <Clipboard
              value={vcdOrganization?.currentState?.apiUrl}
              className="w-full"
            />
          ),
        },
        {
          id: 'vdcId',
          label: ID_LABEL,
          value: <Clipboard value={vcdDatacentre?.id} className="w-full" />,
        },
      ].filter(Boolean)}
    />
  );
}
