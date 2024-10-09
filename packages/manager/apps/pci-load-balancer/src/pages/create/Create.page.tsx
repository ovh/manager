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
import { useTranslation } from 'react-i18next';
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
import { useState } from 'react';
import SizeInputComponent from '@/pages/create/SizeInput.component';
import {
  AGORA_FLOATING_IP_REGEX,
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
} from '@/constants';
import { StepsEnum, useNewLoadBalancerStore } from '@/pages/create/store';
import { TRegion, useGetRegions } from '@/api/hook/usePlans';
import { useGetFloatingIps } from '@/api/hook/useRegion';

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
  const { data: project } = useProject();
  const { me } = useMe();
  const store = useNewLoadBalancerStore();
  const { data: catalog } = useCatalog();
  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const [state, setState] = useState<TState>({
    selectedContinent: undefined,
  });
  const { data: floatingIps } = useGetFloatingIps(
    projectId,
    store.region?.name,
  );

  const productPageLink =
    PRODUCT_LINK[me?.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;
  const regionPageLink =
    REGION_AVAILABILITY_LINK[me?.ovhSubsidiary] ||
    REGION_AVAILABILITY_LINK.DEFAULT;

  const regions = useGetRegions(projectId);

  const floatingIpsList = [
    {
      associatedEntity: '',
      id: 'create',
      ip: tCreate(
        'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
      ),
      networkId: '',
      status: '',
    },
    {
      associatedEntity: '',
      id: 'none',
      ip: tCreate(
        'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
      ),
      networkId: '',
      status: '',
    },
    ...(floatingIps || []),
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

              store.open(StepsEnum.PUBLIC_IP);
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
      </div>
    </>
  );
}
