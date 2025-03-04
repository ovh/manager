import { useEffect } from 'react';
import {
  OsdsFormField,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';
import { useGetPrivateNetworkSubnets } from '@/api/hook/useNetwork';
import { useCreateStore } from '@/pages/create/store';
import { useTranslatedLinkReference } from '@/hooks/useTranslatedLinkReference';
import { FloatingIpSelectionId } from '@/types/floating.type';

export const SubnetsPart = (): JSX.Element => {
  const { t: tCreate } = useTranslation('load-balancer/create');

  const { projectId } = useParams();

  const store = useCreateStore();

  const { list: subnets, isFetching } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );

  const projectHref = useProjectUrl('public-cloud');

  const networkTrack = useTranslatedLinkReference();

  useEffect(() => {
    if (!isFetching) {
      store.set.subnet(subnets?.[0] ?? null);
    }
  }, [subnets, isFetching, store.set]);

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
              {tCreate(
                'octavia_load_balancer_create_private_network_field_subnet',
              )}
            </OsdsText>

            <OsdsSelect
              key={store.subnet?.id}
              className="w-[20rem]"
              value={store.subnet?.id}
              error={false}
              onOdsValueChange={(event) => {
                const targetSubnet = subnets.find(
                  (sub) => sub.id === event.target.value,
                );
                store.set.subnet(targetSubnet);
              }}
              inline
              {...(subnets.length === 0 ? { disabled: true } : {})}
            >
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._200}
                slot="placeholder"
              >
                {tCreate(
                  'octavia_load_balancer_create_private_network_field_subnet',
                )}
              </OsdsText>
              {subnets.map((subnet) => (
                <OsdsSelectOption value={subnet.id} key={subnet.id}>
                  {subnet.cidr}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
          {!store.subnet &&
            store.publicIp !== FloatingIpSelectionId.UNATTACHED && (
              <OsdsMessage
                className="mt-8"
                type={ODS_MESSAGE_TYPE.error}
                color={ODS_THEME_COLOR_INTENT.error}
              >
                <div className="grid grid-cols-1 gap-1">
                  <p>
                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.error}
                    >
                      <span
                        ref={networkTrack}
                        dangerouslySetInnerHTML={{
                          __html: tCreate(
                            'octavia_load_balancer_create_private_network_no_subnet_text',
                            {
                              createPrivateNetworkLink: `${projectHref}/private-networks/new`,
                              trackLabel:
                                LOAD_BALANCER_CREATION_TRACKING.CREATE_PRIVATE_NETWORK,
                            },
                          ),
                        }}
                      ></span>
                    </OsdsText>
                  </p>
                </div>
              </OsdsMessage>
            )}
        </>
      )}
    </>
  );
};
