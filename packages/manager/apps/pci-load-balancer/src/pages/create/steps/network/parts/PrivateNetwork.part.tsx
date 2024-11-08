import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetRegionPrivateNetworks } from '@/api/hook/useNetwork';
import { useCreateStore } from '@/pages/create/store';
import { SubnetsPart } from '@/pages/create/steps/network/parts/Subnets.part';

export const PrivateNetworkPart = (): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  const { projectId } = useParams();
  const store = useCreateStore();

  const { isFetching: isPrivateNetworksPending } = useGetRegionPrivateNetworks(
    projectId,
    store.region?.name,
  );

  const {
    data: privateNetworks,
    list: privateNetworksList,
  } = useGetRegionPrivateNetworks(projectId, store.region?.name);

  return (
    <>
      {isPrivateNetworksPending ? (
        <OsdsSpinner inline />
      ) : (
        <>
          <OsdsFormField className="mt-8" inline>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.subheading}
              slot="label"
            >
              {tCreate('octavia_load_balancer_create_private_network_field')}
            </OsdsText>
            <OsdsSelect
              className="w-[20rem]"
              value={store.privateNetwork?.id}
              error={false}
              onOdsValueChange={(event) => {
                const targetNetwork = (privateNetworks || []).find(
                  (ip) => ip.id === event.target.value,
                );
                store.set.privateNetwork(targetNetwork);
              }}
              inline
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._200}
                slot="placeholder"
              >
                {tCreate('octavia_load_balancer_create_private_network_field')}
              </OsdsText>
              {privateNetworksList?.map((network) => (
                <OsdsSelectOption value={network.id} key={network.id}>
                  {network.name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
          <SubnetsPart />
        </>
      )}
    </>
  );
};
