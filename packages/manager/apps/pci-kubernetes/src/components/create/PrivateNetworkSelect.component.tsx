import { useProjectUrl } from '@ovhcloud/manager-components';
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
import { TNetwork } from '@/api/data/network';
import { TFormState } from './NetworkClusterStep.component';

export type PrivateNetworkSelectProps = {
  formState: TFormState;
  setFormState: (formState) => void;
  networks: TNetwork[];
};

export default function PrivateNetworkSelect({
  formState,
  setFormState,
  networks,
}: Readonly<PrivateNetworkSelectProps>) {
  const { t } = useTranslation('network-add');

  const defaultNetwork = {
    id: null,
    name: t('kubernetes_network_form_none'),
  } as TNetwork;

  const projectURL = useProjectUrl('public-cloud');
  const privateNetworkURL = `${projectURL}/private-networks`;

  const onPrivateNetworkChanged = (event) => {
    const networkId = `${event.detail.value}`;
    setFormState((prev) => ({
      ...prev,
      privateNetwork: networks.find((network) => network.id === networkId),
      loadBalancersSubnet: null,
      subnet: null,
    }));
  };

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
        </OsdsText>
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={privateNetworkURL}
          target={OdsHTMLAnchorElementTarget._top}
        >
          {t('kubernetes_network_form_add')}
        </OsdsLink>
      </div>
      <OsdsFormField
        inline
        className="mb-5 w-full"
        data-ng-attr-label={t('kubernetes_network_form_label')}
      >
        <OsdsSelect
          name="privateNetwork"
          size={ODS_SELECT_SIZE.md}
          value={formState.privateNetwork?.id}
          onOdsValueChange={onPrivateNetworkChanged}
        >
          <OsdsSelectOption value={defaultNetwork.id}>
            {defaultNetwork.name}
          </OsdsSelectOption>
          {networks?.map((network) => (
            <OsdsSelectOption value={network.id} key={network.id}>
              {network.name}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>
    </section>
  );
}
