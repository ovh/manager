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
import {
  useRegionFloatingIpAddons,
  useSelectFloatingIps,
} from '@/api/hook/useFloatingIps/useFloatingIps';
import { FloatingIpSelectionId } from '@/api/hook/useFloatingIps/useFloatingIps.constant';

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

  const { floatingIps, isFetching } = useSelectFloatingIps(projectId, region);

  const { addons, isFetching: isFetchingAddons } = useRegionFloatingIpAddons(
    ovhSubsidiary,
    projectId,
    region,
  );

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
            {...(floatingIps.length === 0 ? { disabled: true } : {})}
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._200}
              slot="placeholder"
            >
              {t('octavia_load_balancer_create_floating_ip_field')}
            </OsdsText>
            {floatingIps.map(({ id, label }) => (
              <OsdsSelectOption value={id} key={id}>
                {t(label)}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </OsdsFormField>
      )}
      {[FloatingIpSelectionId.NEW, FloatingIpSelectionId.UNATTACHED].includes(
        store.publicIp as FloatingIpSelectionId,
      ) &&
        !isFetchingAddons && (
          <IpStepMessages publicIpId={store.publicIp} price={price} />
        )}
    </StepComponent>
  );
};
