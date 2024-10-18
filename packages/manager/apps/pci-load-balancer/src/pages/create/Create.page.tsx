import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsLink,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  TilesInputComponent,
  useCatalogPrice,
  useMe,
  useNotifications,
  useProjectUrl,
  StepComponent,
} from '@ovh-ux/manager-react-components';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import { useCatalog, useProject } from '@ovh-ux/manager-pci-common';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import SizeInputComponent from '@/pages/create/SizeInput.component';
import {
  AGORA_FLOATING_IP_REGEX,
  AGORA_GATEWAY_REGEX,
  FLOATING_IP_TYPE,
  GETTING_STARTED_LINK,
  LOAD_BALANCER_CREATION_TRACKING,
  LOAD_BALANCER_NAME_REGEX,
  MAX_INSTANCES_BY_LISTENER,
  MAX_LISTENER,
  NETWORK_PRIVATE_VISIBILITY,
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
} from '@/constants';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { TRegion, useGetRegions } from '@/api/hook/useRegions';
import {
  useGetPrivateNetworkSubnets,
  useGetRegionPrivateNetworks,
} from '@/api/hook/useNetwork';
import { InstanceTable } from '@/components/create/InstanceTable.component';
import { useGetFloatingIps } from '@/api/hook/useFloatingIps';
import { useGetSubnetGateways } from '@/api/hook/useGateways';
import { useGetFlavor } from '@/api/hook/useFlavors';
import { useGetAddons } from '@/api/hook/useAddons';
import { useTranslatedLinkReference } from '@/hooks/useTranslatedLinkReference';

type TState = {
  selectedContinent: string | undefined;
  isNameTouched: boolean;
};

export default function CreatePage(): JSX.Element {
  const { tracking } = useContext(ShellContext).shell;
  const instanceTrack = useTranslatedLinkReference();
  const networkTrack = useTranslatedLinkReference();

  const trackStep = useCallback(
    (step: number) => {
      tracking.trackClick({
        name: LOAD_BALANCER_CREATION_TRACKING[`FINISH_STEP_${step}`],
        type: 'action',
      });
    },
    [tracking],
  );

  const navigate = useNavigate();
  const { addSuccess, addError } = useNotifications();

  const projectHref = useProjectUrl('public-cloud');

  const backHref = useHref('..');

  const { projectId } = useParams();

  const { t } = useTranslation('octavia-load-balancer');
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tRegionsList } = useTranslation('regions-list');

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const store = useCreateStore();

  const [state, setState] = useState<TState>({
    selectedContinent: undefined,
    isNameTouched: false,
  });

  const { me } = useMe();

  const { data: project } = useProject();
  const { data: addons, isPending: isAddonsPending } = useGetAddons();
  const { data: catalog } = useCatalog();
  const {
    data: privateNetworks,
    isPending: isPrivateNetworksPending,
  } = useGetRegionPrivateNetworks(projectId, store.region?.name);
  const {
    data: floatingIps,
    isPending: isFloatingIpsPending,
  } = useGetFloatingIps(projectId, store.region?.name);
  const {
    data: subnets,
    isPending: isSubnetsPending,
  } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );

  const {
    data: subnetGateways,
    isPending: isSubnetGatewaysPending,
  } = useGetSubnetGateways(projectId, store.region?.name, store.subnet?.id);

  const { data: regions, isPending: isRegionsPending } = useGetRegions(
    projectId,
  );

  const { data: flavor } = useGetFlavor(
    projectId,
    store.region?.name,
    store.addon,
  );

  const [floatingIpsList, privateNetworksList, subnetsList] = [
    useMemo(
      () => [
        {
          associatedEntity: null,
          id: 'create',
          ip: tCreate(
            'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
          ),
          networkId: '',
          status: '',
          type: FLOATING_IP_TYPE.CREATE,
        },
        {
          associatedEntity: null,
          id: 'none',
          ip: tCreate(
            'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
          ),
          networkId: '',
          status: '',
          type: FLOATING_IP_TYPE.NO_IP,
        },
        ...(floatingIps || [])
          .filter((ip) => !ip.associatedEntity)
          .map((ip) => ({
            ...ip,
            type: FLOATING_IP_TYPE.IP,
          })),
      ],
      [floatingIps],
    ),
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
    store.reset();
    store.set.projectId(projectId);
  }, []);

  useEffect(() => {
    if (floatingIpsList.length > 0) {
      store.set.publicIp(floatingIpsList[0]);
    }
  }, [floatingIpsList]);

  useEffect(() => {
    if (privateNetworksList.length > 0) {
      store.set.privateNetwork(privateNetworksList[0]);
    }
  }, [privateNetworksList]);

  useEffect(() => {
    if (subnetsList.length > 0) {
      store.set.subnet(subnetsList[0]);
    }
  }, [subnetsList]);

  useEffect(() => {
    store.set.gateways(subnetGateways || []);
  }, [subnetGateways]);

  useEffect(() => {
    if (store.region) {
      const date = new Date();
      const maxRandomNumber = 9999;

      store.set.name(
        `LB_${store.addon.code.toUpperCase()}_${
          store.region.name
        }-${date.getDate()}${date.getMonth() + 1}-${(Math.floor(
          Math.random() * maxRandomNumber,
        ) *
          new Date().getMilliseconds()) %
          maxRandomNumber}`,
      );
    }
  }, [store.region]);

  const create = async () => {
    tracking.trackClick({
      name: LOAD_BALANCER_CREATION_TRACKING.SUBMIT,
      type: 'action',
    });

    tracking.trackClick({
      name: `${LOAD_BALANCER_CREATION_TRACKING.CONFIRM}::${store.addon.code}::${store.region.name}`,
      type: 'action',
    });

    await store.create(
      flavor,
      () => {
        tracking.trackPage({
          name: LOAD_BALANCER_CREATION_TRACKING.SUCCESS,
          type: 'navigation',
        });
        addSuccess(
          <Translation ns="create">
            {(_t) => _t('octavia_load_balancer_create_banner')}
          </Translation>,
          false,
        );
        navigate('..');
      },
      (error: ApiError) => {
        tracking.trackPage({
          name: LOAD_BALANCER_CREATION_TRACKING.ERROR,
          type: 'navigation',
        });
        addError(
          <Translation ns="octavia-load-balancer">
            {(_t) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: _t('octavia_load_balancer_global_error', {
                    message: ((error.response as unknown) as {
                      data: { message: string };
                    }).data.message,
                    requestId: ((error.response as unknown) as {
                      headers: Record<string, unknown>;
                    }).headers['x-ovh-queryid'],
                  }),
                }}
              ></span>
            )}
          </Translation>,
          false,
        );
      },
    );
  };

  const cancel = () => {
    tracking.trackClick({
      name: LOAD_BALANCER_CREATION_TRACKING.CANCEL,
      type: 'action',
    });
    store.reset();
    navigate('..');
  };

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project?.description,
          },
          {
            href: backHref,
            label: t('octavia_load_balancers'),
          },
          {
            label: tCreate('octavia_load_balancer_create_title'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers title={tCreate('octavia_load_balancer_create_title')} />
      </div>

      <Notifications />

      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate('octavia_load_balancer_create_description')}
      </OsdsText>

      <div className="mt-6">
        <StepComponent
          title={tCreate('octavia_load_balancer_create_size_title')}
          isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
          isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
          isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
          order={1}
          next={{
            action: () => {
              trackStep(1);

              store.check(StepsEnum.SIZE);
              store.lock(StepsEnum.SIZE);

              store.open(StepsEnum.REGION);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.addon === null,
          }}
          edit={{
            action: () => {
              store.unlock(StepsEnum.SIZE);
              store.uncheck(StepsEnum.SIZE);
              store.open(StepsEnum.SIZE);
              store.reset(
                StepsEnum.REGION,
                StepsEnum.PUBLIC_IP,
                StepsEnum.PRIVATE_NETWORK,
                StepsEnum.INSTANCE,
                StepsEnum.NAME,
              );
            },
            label: tCommon('common_stepper_modify_this_step'),
          }}
        >
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate('octavia_load_balancer_create_size_intro')}{' '}
            <OsdsLink
              href={PRODUCT_LINK[me?.ovhSubsidiary] || PRODUCT_LINK.DEFAULT}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {tCreate('octavia_load_balancer_create_size_intro_link')}
            </OsdsLink>
          </OsdsText>
          {isAddonsPending ? (
            <div className="text-center mt-6">
              <OsdsSpinner inline />
            </div>
          ) : (
            <SizeInputComponent
              addons={addons || []}
              value={store.addon}
              onInput={store.set.addon}
            />
          )}
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_region_title')}
          isOpen={store.steps.get(StepsEnum.REGION).isOpen}
          isChecked={store.steps.get(StepsEnum.REGION).isChecked}
          isLocked={store.steps.get(StepsEnum.REGION).isLocked}
          order={2}
          next={{
            action: () => {
              trackStep(2);

              store.check(StepsEnum.REGION);
              store.lock(StepsEnum.REGION);

              store.open(StepsEnum.PUBLIC_IP);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.region === null,
          }}
          edit={{
            action: () => {
              store.unlock(StepsEnum.REGION);
              store.uncheck(StepsEnum.REGION);
              store.open(StepsEnum.REGION);
              store.reset(
                StepsEnum.PUBLIC_IP,
                StepsEnum.PRIVATE_NETWORK,
                StepsEnum.INSTANCE,
                StepsEnum.NAME,
              );
            },
            label: tCommon('common_stepper_modify_this_step'),
          }}
        >
          <div className="mb-4">
            <OsdsText
              size={ODS_TEXT_SIZE._400}
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
            >
              {tCreate('octavia_load_balancer_create_region_intro')}{' '}
              <OsdsLink
                href={
                  REGION_AVAILABILITY_LINK[me?.ovhSubsidiary] ||
                  REGION_AVAILABILITY_LINK.DEFAULT
                }
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {tCreate('octavia_load_balancer_create_region_link')}
              </OsdsLink>
            </OsdsText>
          </div>
          {isRegionsPending ? (
            <div className="text-center mt-6">
              <OsdsSpinner inline />
            </div>
          ) : (
            <TilesInputComponent<TRegion, string, string>
              items={(regions?.get(store.addon?.code) || []).filter(
                (region) => region.isEnabled,
              )}
              value={store.region}
              onInput={(region) => store.set.region(region)}
              label={(region) => region.name}
              group={{
                by: (region) => region.continent,
                label: (continent) => (
                  <OsdsText
                    breakSpaces={false}
                    size={ODS_THEME_TYPOGRAPHY_SIZE._600}
                    color={
                      continent === state.selectedContinent
                        ? ODS_THEME_COLOR_INTENT.text
                        : ODS_THEME_COLOR_INTENT.primary
                    }
                  >
                    <div
                      className={clsx(
                        continent === state.selectedContinent && 'font-bold',
                        'whitespace-nowrap px-2 text-lg',
                      )}
                    >
                      {undefined === continent
                        ? tRegionsList('pci_project_regions_list_continent_all')
                        : continent}
                    </div>
                  </OsdsText>
                ),
                showAllTab: true,
              }}
              stack={{
                by: (region) => region?.macroName,
                label: (macroName) => macroName,
                title: () => tRegionsList('pci_project_regions_list_region'),
                onChange: (continent) => {
                  setState({ ...state, selectedContinent: continent });
                },
              }}
            />
          )}
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_floating_ip_title')}
          isOpen={store.steps.get(StepsEnum.PUBLIC_IP).isOpen}
          isChecked={store.steps.get(StepsEnum.PUBLIC_IP).isChecked}
          isLocked={store.steps.get(StepsEnum.PUBLIC_IP).isLocked}
          order={3}
          next={{
            action: () => {
              trackStep(3);

              store.check(StepsEnum.PUBLIC_IP);
              store.lock(StepsEnum.PUBLIC_IP);

              store.open(StepsEnum.PRIVATE_NETWORK);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.publicIp === null,
          }}
          edit={{
            action: () => {
              store.unlock(StepsEnum.PUBLIC_IP);
              store.uncheck(StepsEnum.PUBLIC_IP);
              store.open(StepsEnum.PUBLIC_IP);
              store.reset(
                StepsEnum.PRIVATE_NETWORK,
                StepsEnum.INSTANCE,
                StepsEnum.NAME,
              );
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
            {tCreate('octavia_load_balancer_create_floating_ip_intro')}
          </OsdsText>
          {isFloatingIpsPending ? (
            <div>
              <OsdsSpinner inline />
            </div>
          ) : (
            <OsdsFormField className="mt-8" inline error="">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._100}
                level={ODS_TEXT_LEVEL.subheading}
                slot="label"
              >
                {tCreate('octavia_load_balancer_create_floating_ip_field')}
              </OsdsText>
              <OsdsSelect
                className="w-[20rem]"
                value={store.publicIp?.id}
                error={false}
                onOdsValueChange={(event) => {
                  const targetIp = floatingIpsList.find(
                    (ip) => ip.id === event.target.value,
                  );
                  store.set.publicIp(targetIp);
                }}
                inline
                {...(floatingIpsList.length === 0 ? { disabled: true } : {})}
              >
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.text}
                  size={ODS_TEXT_SIZE._200}
                  slot="placeholder"
                >
                  {tCreate('octavia_load_balancer_create_floating_ip_field')}
                </OsdsText>
                {floatingIpsList.map((ip) => (
                  <OsdsSelectOption value={ip.id} key={ip.id}>
                    {ip.ip}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
            </OsdsFormField>
          )}
          {store.publicIp?.id === 'create' && (
            <OsdsMessage
              className="mt-8"
              type={ODS_MESSAGE_TYPE.info}
              color={ODS_THEME_COLOR_INTENT.info}
            >
              <div className="grid grid-cols-1 gap-8 py-6">
                <div>
                  <OsdsText
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {tCreate(
                      'octavia_load_balancer_create_floating_ip_new_information',
                    )}
                  </OsdsText>
                </div>
                <div>
                  <OsdsText
                    size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {tCreate(
                      'octavia_load_balancer_create_floating_ip_new_price',
                      {
                        price: getFormattedHourlyCatalogPrice(
                          catalog?.addons.filter((addon) =>
                            addon.planCode.match(AGORA_FLOATING_IP_REGEX),
                          )[0].pricings[0].price,
                        ),
                      },
                    )}

                    {tCreate(
                      'octavia_load_balancer_create_floating_ip_new_price_interval',
                    )}
                  </OsdsText>
                </div>
              </div>
            </OsdsMessage>
          )}
          {store.publicIp?.id === 'none' && (
            <OsdsMessage
              className="mt-10"
              type={ODS_MESSAGE_TYPE.warning}
              color={ODS_THEME_COLOR_INTENT.warning}
            >
              <OsdsText
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tCreate(
                  'octavia_load_balancer_create_floating_ip_no_floating_ip_information',
                )}
              </OsdsText>
            </OsdsMessage>
          )}
        </StepComponent>
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
              <OsdsSpinner inline />
            </div>
          ) : (
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
                  {tCreate(
                    'octavia_load_balancer_create_private_network_field',
                  )}
                </OsdsText>
                {privateNetworksList.map((network) => (
                  <OsdsSelectOption value={network.id} key={network.id}>
                    {network.name}
                  </OsdsSelectOption>
                ))}
              </OsdsSelect>
            </OsdsFormField>
          )}
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
          {isSubnetGatewaysPending ? (
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
        <StepComponent
          title={tCreate('octavia_load_balancer_create_instance_title')}
          isOpen={store.steps.get(StepsEnum.INSTANCE).isOpen}
          isChecked={store.steps.get(StepsEnum.INSTANCE).isChecked}
          isLocked={store.steps.get(StepsEnum.INSTANCE).isLocked}
          order={5}
          next={{
            action: () => {
              trackStep(5);

              store.check(StepsEnum.INSTANCE);
              store.lock(StepsEnum.INSTANCE);

              store.open(StepsEnum.NAME);
            },
            label: tCommon('common_stepper_next_button_label'),
          }}
          edit={{
            action: () => {
              store.unlock(StepsEnum.INSTANCE);
              store.uncheck(StepsEnum.INSTANCE);
              store.open(StepsEnum.INSTANCE);
              store.reset(StepsEnum.NAME);
            },
            label: tCommon('common_stepper_modify_this_step'),
          }}
          skip={{
            action: () => {
              tracking.trackClick({
                name: LOAD_BALANCER_CREATION_TRACKING.SKIP_STEP_5,
                type: 'action',
              });
              store.set.listeners([]);

              store.check(StepsEnum.INSTANCE);
              store.lock(StepsEnum.INSTANCE);

              store.open(StepsEnum.NAME);
            },
            label: tCommon('common_stepper_skip_this_step'),
            hint: `${tCommon('common_stepper_optional_label')}`,
          }}
        >
          <Translation ns="create">
            {(_t) => (
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                className="mb-4"
              >
                <span
                  ref={instanceTrack}
                  dangerouslySetInnerHTML={{
                    __html: _t('octavia_load_balancer_create_instance_intro', {
                      linkUrl:
                        GETTING_STARTED_LINK[me?.ovhSubsidiary] ||
                        GETTING_STARTED_LINK.DEFAULT,
                      trackLabel:
                        LOAD_BALANCER_CREATION_TRACKING.GO_TO_INSTANCE_DOCUMENTATION,
                    }),
                  }}
                ></span>
              </OsdsText>
            )}
          </Translation>
          <OsdsMessage
            className="mt-8"
            type={ODS_MESSAGE_TYPE.info}
            color={ODS_THEME_COLOR_INTENT.info}
          >
            <div className="grid grid-cols-1 gap-1">
              <p>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tCreate(
                    'octavia_load_balancer_create_instance_banner_text',
                    {
                      maxListeners: MAX_LISTENER,
                      maxInstances: MAX_INSTANCES_BY_LISTENER,
                    },
                  )}
                </OsdsText>
              </p>
              <p>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  <b>
                    {tCreate(
                      'octavia_load_balancer_create_instance_banner_text_bold',
                    )}
                  </b>
                </OsdsText>
              </p>
              <p>
                <OsdsText
                  size={ODS_TEXT_SIZE._400}
                  level={ODS_TEXT_LEVEL.body}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tCreate(
                    'octavia_load_balancer_create_instance_banner_health_monitor_text',
                  )}
                </OsdsText>
              </p>
            </div>
          </OsdsMessage>
          <InstanceTable
            className="mt-4"
            projectId={projectId}
            region={store.region?.name}
            onChange={(listeners) => {
              store.set.listeners(listeners);
            }}
          />
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_name_field_label')}
          isOpen={store.steps.get(StepsEnum.NAME).isOpen}
          isChecked={store.steps.get(StepsEnum.NAME).isChecked}
          isLocked={store.steps.get(StepsEnum.NAME).isLocked}
          order={6}
        >
          <OsdsFormField
            className="mt-8"
            inline
            error={
              state.isNameTouched &&
              (!store.name.match(LOAD_BALANCER_NAME_REGEX) ||
                store.name.length > 70)
                ? tCommon('common_field_error_pattern')
                : ''
            }
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.subheading}
              slot="label"
            >
              {tCreate('octavia_load_balancer_create_name_field_label')}
            </OsdsText>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._100}
              level={ODS_TEXT_LEVEL.subheading}
              slot="helper"
            >
              {tCreate('octavia_load_balancer_create_name_field_help')}
            </OsdsText>
            <OsdsInput
              value={store.name}
              type={ODS_INPUT_TYPE.text}
              onOdsValueChange={(event) =>
                store.set.name(event.target.value as string)
              }
              className={
                state.isNameTouched &&
                (!store.name.match(LOAD_BALANCER_NAME_REGEX) ||
                  store.name.length > 70)
                  ? 'bg-red-100 border-red-500 text-red-500 focus:text-red-500'
                  : 'border-color-[var(--ods-color-default-200)] bg-white'
              }
              onOdsInputBlur={() => {
                setState({
                  ...state,
                  isNameTouched: true,
                });
              }}
            />
          </OsdsFormField>
          <div className="mt-8">
            <OsdsButton
              inline
              color={ODS_THEME_COLOR_INTENT.info}
              onClick={create}
            >
              {tCreate('octavia_load_balancer_create_title')}
            </OsdsButton>
            <OsdsButton
              inline
              variant={ODS_BUTTON_VARIANT.ghost}
              color={ODS_THEME_COLOR_INTENT.info}
              onClick={cancel}
            >
              {tCommon('common_cancel')}
            </OsdsButton>
          </div>
        </StepComponent>
      </div>
    </>
  );
}
