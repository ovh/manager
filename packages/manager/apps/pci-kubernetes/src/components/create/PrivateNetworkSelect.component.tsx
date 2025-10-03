import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';

import { useProjectUrl } from '@ovh-ux/manager-react-components';

import { TNetwork, TNetworkRegion } from '@/api/data/network';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import {
  getListGatewaysQueryKey,
  getQueryKeyPrivateNetworksByRegion,
} from '@/api/hooks/useNetwork';
import { isMonoDeploymentZone } from '@/helpers';
import queryClient from '@/queryClient';
import { DeploymentMode } from '@/types';

export type PrivateNetworkSelectProps = {
  network: TNetworkRegion;
  onSelect: (network: TNetworkRegion) => void;
  networks: TNetworkRegion[];
  type: DeploymentMode;
  region: string;
  subnet: TPrivateNetworkSubnet;
};

export default function PrivateNetworkSelect({
  network,
  onSelect,
  networks,
  region,
  type,
  subnet,
}: Readonly<PrivateNetworkSelectProps>) {
  const { t } = useTranslation('network-add');

  const { projectId } = useParams();

  const refresh = () => {
    queryClient.invalidateQueries({
      queryKey: getQueryKeyPrivateNetworksByRegion(projectId, region),
    });
    queryClient.invalidateQueries({
      queryKey: getListGatewaysQueryKey(projectId, region, subnet.id),
    });
  };

  const defaultNetwork = {
    id: 'none',
    name: t('kubernetes_network_form_none'),
  } as TNetwork;

  const projectURL = useProjectUrl('public-cloud');
  const privateNetworkURL = `${projectURL}/private-networks`;

  return (
    <section>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block mb-4 mt-4"
      >
        {t('kubernetes_network_form_label')}
      </OsdsText>

      <div className="mb-2">
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {t('kubernetes_network_form_description')}
        </OsdsText>{' '}
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={privateNetworkURL}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {t('kubernetes_network_form_add')}
          <OsdsIcon
            className="ml-5"
            aria-hidden="true"
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xxs}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsLink>
      </div>
      <div className="flex flex-row items-center gap-4">
        <OsdsFormField inline className="mb-5 w-full lg:w-1/2">
          <OsdsSelect
            className="mt-4"
            name="privateNetwork"
            size={ODS_SELECT_SIZE.md}
            value={network?.id || (isMonoDeploymentZone(type) ? defaultNetwork.id : null)}
            onOdsValueChange={(ev) => {
              const networkId = `${ev.detail.value}`;
              onSelect(networks?.find((net) => net.id === networkId));
            }}
          >
            <span slot="placeholder">{t('kubernetes_network_form_select_private_option')}</span>
            {isMonoDeploymentZone(type) && (
              <OsdsSelectOption value={defaultNetwork.id}>{defaultNetwork.name}</OsdsSelectOption>
            )}
            {networks?.map((net) => (
              <OsdsSelectOption value={net.id} key={net.id}>
                {net.name}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
        <OsdsButton
          data-testid="refresh-button"
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0 ml-0.5"
          onClick={() => {
            refresh();
          }}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.REFRESH}
            className="mr-2 bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsButton>
      </div>
    </section>
  );
}
