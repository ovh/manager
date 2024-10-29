import {
  OsdsFormField,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  useCatalogPrice,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCatalog } from '@ovh-ux/manager-pci-common';
import {
  AGORA_GATEWAY_REGEX,
  FLOATING_IP_TYPE,
  LOAD_BALANCER_CREATION_TRACKING,
  NETWORK_PRIVATE_VISIBILITY,
} from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTrackStep } from '@/pages/create/hooks/useTrackStep';
import {
  useGetPrivateNetworkSubnets,
  useGetRegionPrivateNetworks,
} from '@/api/hook/useNetwork';
import { useTranslatedLinkReference } from '@/hooks/useTranslatedLinkReference';
import { useGetSubnetGateways } from '@/api/hook/useGateways';

export const NetworkStep = (): JSX.Element => {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tCreate } = useTranslation('load-balancer/create');

  const { projectId } = useParams();

  const projectHref = useProjectUrl('public-cloud');

  const store = useCreateStore();

  const {
    data: privateNetworks,
    isPending: isPrivateNetworksPending,
  } = useGetRegionPrivateNetworks(projectId, store.region?.name);
  const {
    data: subnets,
    isPending: isSubnetsPending,
  } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );
  const {
    isPending: isSubnetGatewaysPending,
    isFetching: isSubnetGatewaysFetching,
  } = useGetSubnetGateways(projectId, store.region?.name, store.subnet?.id);
  const { data: catalog } = useCatalog();

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const { trackStep } = useTrackStep();
  const networkTrack = useTranslatedLinkReference();

  const [privateNetworksList, subnetsList] = [
    useMemo(
      () =>
        (privateNetworks || []).filter(
          (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
        ),
      [privateNetworks],
    ),
    useMemo(() => {
      if (!subnets) {
        return [];
      }
      return store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP
        ? subnets.filter((subnet) => subnet.gatewayIp)
        : subnets;
    }, [subnets, store.publicIp]),
  ];

  useEffect(() => {
    store.set.subnet(subnetsList.length ? subnetsList[0] : null);
  }, [subnetsList]);

  return (
    <StepComponent
      title={tCreate('octavia_load_balancer_create_private_network_title')}
      isOpen={store.steps.get(StepsEnum.PRIVATE_NETWORK).isOpen}
      isChecked={store.steps.get(StepsEnum.PRIVATE_NETWORK).isChecked}
      isLocked={store.steps.get(StepsEnum.PRIVATE_NETWORK).isLocked}
      order={4}
      next={{
        action: () => {
          trackStep(4);

          store.check(StepsEnum.PRIVATE_NETWORK);
          store.lock(StepsEnum.PRIVATE_NETWORK);

          store.open(StepsEnum.INSTANCE);
        },
        label: tCommon('common_stepper_next_button_label'),
        isDisabled:
          subnetsList.length === 0 &&
          store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.PRIVATE_NETWORK);
          store.uncheck(StepsEnum.PRIVATE_NETWORK);
          store.open(StepsEnum.PRIVATE_NETWORK);
          store.reset(StepsEnum.INSTANCE, StepsEnum.NAME);
        },
        label: tCommon('common_stepper_modify_this_step'),
      }}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-4"
      >
        {tCreate('octavia_load_balancer_create_private_network_intro')}
      </OsdsText>
      {isPrivateNetworksPending ? (
        <div>
          hello
          <OsdsSpinner inline />
        </div>
      ) : (
        <>
          <OsdsFormField className="mt-8" inline error="">
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
              {privateNetworksList.map((network) => (
                <OsdsSelectOption value={network.id} key={network.id}>
                  {network.name}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>
          {isSubnetsPending ? (
            <div>
              <OsdsSpinner inline />
            </div>
          ) : (
            <>
              <OsdsFormField className="mt-8" inline error="">
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
                    const targetSubnet = subnetsList.find(
                      (sub) => sub.id === event.target.value,
                    );
                    store.set.subnet(targetSubnet);
                  }}
                  inline
                  {...(subnetsList.length === 0 ? { disabled: true } : {})}
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
                  {subnetsList.map((subnet) => (
                    <OsdsSelectOption value={subnet.id} key={subnet.id}>
                      {subnet.cidr}
                    </OsdsSelectOption>
                  ))}
                </OsdsSelect>
              </OsdsFormField>
              {subnetsList.length === 0 &&
                store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP && (
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
      )}

      {isSubnetGatewaysFetching ? (
        <div>
          <OsdsSpinner inline />
        </div>
      ) : (
        <>
          {store.subnet &&
            store.gateways.length !== 0 &&
            store.publicIp.type !== FLOATING_IP_TYPE.NO_IP && (
              <OsdsMessage
                className="mt-8"
                type={ODS_MESSAGE_TYPE.info}
                color={ODS_THEME_COLOR_INTENT.info}
              >
                <div className="grid grid-cols-1">
                  <p>
                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {tCreate(
                        'octavia_load_balancer_create_private_network_no_gateway_text',
                      )}
                    </OsdsText>
                  </p>
                  <p>
                    <OsdsText
                      size={ODS_TEXT_SIZE._400}
                      level={ODS_TEXT_LEVEL.body}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {tCreate(
                        'octavia_load_balancer_create_private_network_no_gateway_text_price',
                      )}
                      {getFormattedHourlyCatalogPrice(
                        catalog.addons.filter((addon) =>
                          addon.planCode.match(AGORA_GATEWAY_REGEX),
                        )[0].pricings[0].price,
                      )}
                    </OsdsText>
                  </p>
                </div>
              </OsdsMessage>
            )}
        </>
      )}
    </StepComponent>
  );
};
