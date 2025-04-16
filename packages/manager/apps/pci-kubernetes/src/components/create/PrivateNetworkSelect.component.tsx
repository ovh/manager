import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsLink,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TNetwork, TNetworkRegion } from '@/api/data/network';
import { isMonoDeploymentZone } from '@/helpers';
import { DeploymentMode } from '@/types';

export type PrivateNetworkSelectProps = {
  network: TNetworkRegion;
  onSelect: (network: TNetworkRegion) => void;
  networks: TNetworkRegion[];
  type: DeploymentMode;
};

export default function PrivateNetworkSelect({
  network,
  onSelect,
  networks,
  type,
}: Readonly<PrivateNetworkSelectProps>) {
  const { t } = useTranslation('network-add');

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
        className="block mb-8"
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
          target={OdsHTMLAnchorElementTarget._top}
        >
          {t('kubernetes_network_form_add')}
        </OsdsLink>
      </div>
      <OsdsFormField inline className="mb-5 w-full">
        <OsdsSelect
          className="mt-4"
          name="privateNetwork"
          size={ODS_SELECT_SIZE.md}
          value={
            network?.id ||
            (isMonoDeploymentZone(type) ? defaultNetwork.id : null)
          }
          onOdsValueChange={(ev) => {
            const networkId = `${ev.detail.value}`;
            onSelect(networks?.find((net) => net.id === networkId));
          }}
        >
          <span slot="placeholder">
            {t('kubernetes_network_form_select_private_option')}
          </span>
          {isMonoDeploymentZone(type) && (
            <OsdsSelectOption value={defaultNetwork.id}>
              {defaultNetwork.name}
            </OsdsSelectOption>
          )}
          {networks?.map((net) => (
            <OsdsSelectOption value={net.id} key={net.id}>
              {net.name}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>
    </section>
  );
}
