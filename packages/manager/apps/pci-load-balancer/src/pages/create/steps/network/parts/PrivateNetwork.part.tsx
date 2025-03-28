import { useEffect } from 'react';
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

  const { list: networks, isFetching } = useGetRegionPrivateNetworks(
    projectId,
    store.region?.name || '',
  );

  useEffect(() => {
    // set default private network
    if (networks?.length > 0) {
      store.set.privateNetwork(networks[0]);
    }
  }, [networks, store.set]);

  return (
    <>
      {isFetching ? (
        <div className="mt-8">
          <OsdsSpinner inline />
        </div>
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
                const targetNetwork = (networks || []).find(
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
              {networks?.map((network) => (
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
