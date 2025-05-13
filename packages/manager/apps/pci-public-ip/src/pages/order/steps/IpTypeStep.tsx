import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TilesInputComponent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { StepIdsEnum } from '@/api/types';
import { useOrderStore } from '@/hooks/order/useStore';
import { useActions } from '@/hooks/order/useActions';
import { StepComponent } from '@/components/container/Step.component';
import { PublicIp } from '@/types/publicip.type';
import TileLabel from '@/components/tile/TileLabel.component';
import { useFailoverCatalog } from '@/api/hooks/useFailoverCatalog/useFailoverCatalog';
import PriceLabel from '@/components/PriceLabel.component';
import { useAddons } from '@/api/hooks/useAddons/useAddons';
import { sortProductByPrice } from '@/api/hooks/useAddons/useAddons.select';
import { FLOATING_IP_ADDON_FAMILY } from '@/api/hooks/useAddons/useAddons.constant';

type TPublicIp = {
  name: string;
  description: string;
  type: PublicIp;
};

export const IpTypeStep = ({
  projectId,
}: {
  projectId: string;
}): JSX.Element => {
  const { t } = useTranslation('order');
  const { form, steps, setForm } = useOrderStore();
  const { On } = useActions(projectId);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const [publicIp, setPublicIp] = useState<TPublicIp>();

  const publicIps: TPublicIp[] = [
    {
      name: t('pci_additional_ip_failover_ip'),
      description: t('pci_additional_ip_failover_ip_description'),
      type: PublicIp.FAILOVER,
    },
    {
      name: t('pci_additional_ip_floating_ip'),
      description: t('pci_additional_ip_floating_ip_description'),
      type: PublicIp.FLOATING,
    },
  ];

  const {
    data: failoverIp,
    isFetching: isFailoverFetching,
  } = useFailoverCatalog(ovhSubsidiary);

  const { addons: floatingIp, isFetching: isFloatingIpFetching } = useAddons({
    ovhSubsidiary,
    projectId,
    addonFamily: FLOATING_IP_ADDON_FAMILY,
    select: sortProductByPrice,
  });

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const selectPublicIp = (value: TPublicIp) => {
    setPublicIp(value);
    setForm({ ...form, ipType: value.type });
  };

  // if there is only one product it means there is only one price
  const floatingIpPrice = useMemo(
    () =>
      floatingIp.length > 1
        ? `${t(
            'pci_floating_ip_price_per_hour',
          )} ${getFormattedHourlyCatalogPrice(floatingIp[0]?.price)}`
        : getFormattedHourlyCatalogPrice(floatingIp[0]?.price),
    [floatingIp, t, getFormattedHourlyCatalogPrice],
  );

  return (
    <StepComponent
      {...steps.get(StepIdsEnum.IP_TYPE)}
      title={t('pci_additional_ip_create_step_select_ip')}
      next={publicIp ? { action: On.next } : {}}
      showDisabledAction
      onEdit={On.edit}
      order={1}
    >
      <TilesInputComponent<TPublicIp>
        items={publicIps}
        value={publicIp}
        label={({ name, description, type }) => (
          <TileLabel title={name} description={description}>
            <div className="text-sm mt-4 text-center font-bold">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <PriceLabel
                  isLoading={
                    type === PublicIp.FAILOVER
                      ? isFailoverFetching
                      : isFloatingIpFetching
                  }
                  value={
                    type === PublicIp.FAILOVER
                      ? t('pci_additional_ip_price_per_month', {
                          price:
                            failoverIp?.details.pricings.default[0].price.text,
                        })
                      : floatingIpPrice
                  }
                  className="font-bold"
                />
              </OsdsText>
            </div>
          </TileLabel>
        )}
        onInput={selectPublicIp}
      />
    </StepComponent>
  );
};
