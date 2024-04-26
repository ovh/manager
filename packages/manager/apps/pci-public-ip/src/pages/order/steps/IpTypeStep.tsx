import { clsx } from 'clsx';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useData } from '@/api/hooks/useData';
import { IPTypeEnum, StepIdsEnum } from '@/api/types';
import { useOrderStore } from '@/pages/order/hooks/useStore';
import { useActions } from '@/pages/order/hooks/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { TileInputComponent } from '@/components/input/TileInput.component';
import { CatalogPriceComponent } from '@/components/CatalogPrice.component';
import { useMe } from '@/api/hooks/useMe';
import { useStepsStore } from '@/pages/order/hooks/useStepsStore';

export const IpTypeStep = ({
  projectId,
  regionName,
}: {
  projectId: string;
  regionName: string;
}): JSX.Element => {
  const { form, setForm } = useOrderStore();
  const { items } = useStepsStore();
  const { on } = useActions(projectId);
  const { state: dataState } = useData(projectId, regionName);
  const { t: tOrder } = useTranslation('order');
  const { t: tStepper } = useTranslation('stepper');
  const { me } = useMe();
  const context = useContext(ShellContext);

  const getIpTypeLabel = useCallback(
    (ipTypeParam: IPTypeEnum) => {
      const ipType = dataState.ipTypes.find(
        ($ipType) => $ipType.name === ipTypeParam,
      );

      return ipType ? (
        <div>
          <div className="border-solid border-0 border-b border-b-[#bef1ff] w-full mx-4 pb-2 text-[#4d5592] text-sm">
            <div
              className={clsx(
                'border-b-[--ods-color-blue-100] font-bold pb-2',
                form.ipType === ipType.name && 'font-bold',
              )}
            >
              <span>{ipType.label}</span>
            </div>
            <div className="pt-2 pb-8 text-[#4d5592] font-sans text-xs">
              {ipType.description}
            </div>
          </div>
          <div className="text-center border-t border-t-[#bef1ff]">
            <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
              {ipType.name === IPTypeEnum.FAILOVER ? (
                tOrder('pci_additional_ip_price_per_month', {
                  price: ipType.price,
                })
              ) : (
                <CatalogPriceComponent
                  price={Number(ipType.price)}
                  user={me}
                  interval="hour"
                  maximumFractionDigits={4}
                  locale={context.environment.getUserLocale()}
                />
              )}
            </OsdsText>
          </div>
        </div>
      ) : (
        ''
      );
    },
    [dataState.ipTypes, form.ipType],
  );

  return (
    <StepComponent
      {...items.get(StepIdsEnum.IP_TYPE)}
      next={{
        action: on.next,
        label: tStepper('common_stepper_next_button_label'),
      }}
      edit={{
        action: on.edit,
        label: tStepper('common_stepper_modify_this_step'),
      }}
      order={1}
    >
      <TileInputComponent<IPTypeEnum, string, string>
        value={form.ipType}
        items={dataState.ipTypes.map((ipType) => ipType.name as IPTypeEnum)}
        label={(item) => getIpTypeLabel(item)}
        onInput={(value) => {
          setForm({ ...form, ipType: value });
        }}
      />
    </StepComponent>
  );
};
