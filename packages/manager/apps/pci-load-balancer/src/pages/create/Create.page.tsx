import {
  OsdsBreadcrumb,
  OsdsFormField,
  OsdsLink,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  StepComponent,
  TilesInputComponent,
  useCatalogPrice,
  useMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { useCatalog, useProject } from '@ovh-ux/manager-pci-common';
import { Translation, useTranslation } from 'react-i18next';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import SizeInputComponent from '@/pages/create/SizeInput.component';
import {
  AGORA_FLOATING_IP_REGEX,
  FLOATING_IP_TYPE,
  GETTING_STARTED_LINK,
  MAX_INSTANCES_BY_LISTENER,
  MAX_LISTENER,
  NETWORK_PRIVATE_VISIBILITY,
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
} from '@/constants';
import { StepsEnum, useNewLoadBalancerStore } from '@/pages/create/store';
import { TRegion, useGetRegions } from '@/api/hook/usePlans';
import { useGetFloatingIps, useGetRegionNetworks } from '@/api/hook/useRegion';
import { useGetPrivateNetworkSubnets } from '@/api/hook/useNetwork';
import { InstanceTable } from '@/components/create/InstanceTable.component';

type TState = {
  selectedContinent: string | undefined;
};

export default function CreatePage(): JSX.Element {
  const projectHref = useProjectUrl('public-cloud');

  const backHref = useHref('..');

  const { projectId } = useParams();

  const { t } = useTranslation('octavia-load-balancer');
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tRegionsList } = useTranslation('regions-list');

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const store = useNewLoadBalancerStore();

  const [state, setState] = useState<TState>({
    selectedContinent: undefined,
  });

  const { me } = useMe();

  const { data: project } = useProject();
  const { data: catalog } = useCatalog();
  const { data: privateNetworks } = useGetRegionNetworks(
    projectId,
    store.region?.name,
  );
  const { data: floatingIps } = useGetFloatingIps(
    projectId,
    store.region?.name,
  );
  const { data: subnets } = useGetPrivateNetworkSubnets(
    projectId,
    store.region?.name,
    store.privateNetwork?.id,
  );

  const regions = useGetRegions(projectId);

  const [floatingIpsList, privateNetworksList] = [
    [
      {
        associatedEntity: '',
        id: 'create',
        ip: tCreate(
          'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
        ),
        networkId: '',
        status: '',
        type: '',
      },
      {
        associatedEntity: '',
        id: 'none',
        ip: tCreate(
          'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
        ),
        networkId: '',
        status: '',
        type: '',
      },
      ...(floatingIps || []),
    ],
    (privateNetworks || []).filter(
      (network) => network.visibility === NETWORK_PRIVATE_VISIBILITY,
    ),
  ];

  const subnetsList = useMemo(() => {
    if (!subnets) {
      return [];
    }
    return store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP
      ? subnets.filter((subnet) => subnet.gatewayIp)
      : subnets;
  }, [subnets, store.publicIp]);

  const [productPageLink, regionPageLink, gettingStartedLink] = [
    PRODUCT_LINK[me?.ovhSubsidiary] || PRODUCT_LINK.DEFAULT,
    REGION_AVAILABILITY_LINK[me?.ovhSubsidiary] ||
      REGION_AVAILABILITY_LINK.DEFAULT,
    GETTING_STARTED_LINK[me?.ovhSubsidiary] || GETTING_STARTED_LINK.DEFAULT,
  ];

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project.description,
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
              store.check(StepsEnum.SIZE);
              store.lock(StepsEnum.SIZE);

              store.open(StepsEnum.REGION);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.size === null,
          }}
        >
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate('octavia_load_balancer_create_size_intro')}{' '}
            <OsdsLink
              href={productPageLink}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {tCreate('octavia_load_balancer_create_size_intro_link')}
            </OsdsLink>
          </OsdsText>
          <SizeInputComponent value={store.size} onInput={store.set.size} />
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_region_title')}
          isOpen={store.steps.get(StepsEnum.REGION).isOpen}
          isChecked={store.steps.get(StepsEnum.REGION).isChecked}
          isLocked={store.steps.get(StepsEnum.REGION).isLocked}
          order={2}
          next={{
            action: () => {
              store.check(StepsEnum.REGION);
              store.lock(StepsEnum.REGION);

              store.open(StepsEnum.PUBLIC_IP);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.region === null,
          }}
        >
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
            className="mb-4"
          >
            {tCreate('octavia_load_balancer_create_region_intro')}{' '}
            <OsdsLink
              href={regionPageLink}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {tCreate('octavia_load_balancer_create_region_link')}
            </OsdsLink>
          </OsdsText>
          <TilesInputComponent<TRegion, string, string>
            items={(regions?.get(store.size?.code) || []).filter(
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
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_floating_ip_title')}
          isOpen={store.steps.get(StepsEnum.PUBLIC_IP).isOpen}
          isChecked={store.steps.get(StepsEnum.PUBLIC_IP).isChecked}
          isLocked={store.steps.get(StepsEnum.PUBLIC_IP).isLocked}
          order={3}
          next={{
            action: () => {
              store.check(StepsEnum.PUBLIC_IP);
              store.lock(StepsEnum.PUBLIC_IP);

              store.open(StepsEnum.PRIVATE_NETWORK);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.publicIp === null,
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
              store.check(StepsEnum.PRIVATE_NETWORK);
              store.lock(StepsEnum.PRIVATE_NETWORK);

              store.open(StepsEnum.INSTANCE);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled:
              subnetsList.length === 0 &&
              store.publicIp?.type !== FLOATING_IP_TYPE.NO_IP,
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
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_instance_title')}
          isOpen={store.steps.get(StepsEnum.INSTANCE).isOpen}
          isChecked={store.steps.get(StepsEnum.INSTANCE).isChecked}
          isLocked={store.steps.get(StepsEnum.INSTANCE).isLocked}
          order={5}
          next={{
            action: () => {
              store.check(StepsEnum.INSTANCE);
              store.lock(StepsEnum.INSTANCE);

              store.open(StepsEnum.INSTANCE);
            },
            label: tCommon('common_stepper_next_button_label'),
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
                  dangerouslySetInnerHTML={{
                    __html: _t('octavia_load_balancer_create_instance_intro', {
                      linkUrl: gettingStartedLink,
                      // TODO track
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
            onChange={(config) => {
              store.set.listeners(config);
            }}
          />
        </StepComponent>
      </div>
    </>
  );
}
