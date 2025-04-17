import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  StepComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { useTracking } from '@/pages/create/hooks/useTracking';
import { IpStepMessages } from '@/pages/create/steps/ip/IpStepMessages';
import { useFloatingIps } from '@/api/hook/useFloatingIps/useFloatingIps';
import { FloatingIpSelectionId } from '@/types/floating.type';
import { useAddons } from '@/api/hook/useAddons/useAddons';
import { FLOATING_IP_ADDON_FAMILY } from '@/api/hook/useAddons/useAddons.constant';
import { filterProductRegionBySize } from '@/api/hook/useAddons/useAddons.select';
import { TProductAddonDetail } from '@/types/product.type';

export type TIpStepProps = {
  ovhSubsidiary: string;
  projectId: string;
};

export const IpStep = ({
  ovhSubsidiary,
  projectId,
}: TIpStepProps): JSX.Element => {
  const { t } = useTranslation(['load-balancer/create', 'pci-common']);

  const { trackStep } = useTracking();

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(5);

  const store = useCreateStore();

  const region = store?.region?.name || '';

  const { data: floatingIps, isFetching } = useFloatingIps(projectId, region);

  const { addons, isFetching: isFetchingAddons } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily: FLOATING_IP_ADDON_FAMILY,
    select: (products: TProductAddonDetail[]) =>
      filterProductRegionBySize(products, region),
  });

  const price = useMemo(
    () => (addons?.[0] ? getFormattedHourlyCatalogPrice(addons[0].price) : ''),
    [addons, getFormattedHourlyCatalogPrice],
  );

  return (
    <StepComponent
      title={t('octavia_load_balancer_create_floating_ip_title')}
      isOpen={store.steps.get(StepsEnum.IP).isOpen}
      isChecked={store.steps.get(StepsEnum.IP).isChecked}
      isLocked={store.steps.get(StepsEnum.IP).isLocked}
      order={3}
      next={{
        action: () => {
          trackStep(3);

          store.check(StepsEnum.IP);
          store.lock(StepsEnum.IP);

          store.open(StepsEnum.NETWORK);
        },
        label: t('pci-common:common_stepper_next_button_label'),
        isDisabled: !store.publicIp,
      }}
      edit={{
        action: () => {
          store.unlock(StepsEnum.IP);
          store.uncheck(StepsEnum.IP);
          store.open(StepsEnum.IP);
          store.reset(StepsEnum.NETWORK, StepsEnum.INSTANCE, StepsEnum.NAME);
        },
        label: t('pci-common:common_stepper_modify_this_step'),
      }}
    >
      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        className="mb-4"
      >
        {t('octavia_load_balancer_create_floating_ip_intro')}
      </OsdsText>
      {isFetching ? (
        <div>
          <OsdsSpinner inline />
        </div>
      ) : (
        <OsdsFormField className="mt-8" inline>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._100}
            level={ODS_TEXT_LEVEL.subheading}
            slot="label"
          >
            {t('octavia_load_balancer_create_floating_ip_field')}
          </OsdsText>
          <OsdsSelect
            className="w-[20rem]"
            value={store.publicIp}
            error={false}
            onOdsValueChange={(event) =>
              store.set.publicIp(event.target.value as string)
            }
            inline
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
              slot="placeholder"
            >
              {t('octavia_load_balancer_create_floating_ip_field')}
            </OsdsText>
            <OsdsSelectOption value={FloatingIpSelectionId.NEW}>
              {t(
                'octavia_load_balancer_create_floating_ip_field_new_floating_ip',
              )}
            </OsdsSelectOption>
            <OsdsSelectOption value={FloatingIpSelectionId.UNATTACHED}>
              {t(
                'octavia_load_balancer_create_floating_ip_field_no_floating_ip',
              )}
            </OsdsSelectOption>
            {floatingIps?.map(({ id, ip }) => (
              <OsdsSelectOption value={id} key={id}>
                {ip}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}
      {(FloatingIpSelectionId.NEW === store.publicIp ||
        FloatingIpSelectionId.UNATTACHED === store.publicIp) &&
        !isFetchingAddons && (
          <IpStepMessages publicIpId={store.publicIp} price={price} />
        )}
    </StepComponent>
  );
};
