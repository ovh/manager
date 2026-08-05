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
import { useBasicIpCatalog } from '@/api/hooks/useBasicIpCatalog';
import { useCreateEditBasicIp } from '@/hooks/useCreateEditBasicIp';

type TIpTypeOption = {
  name: string;
  description: string;
  type: PublicIp;
};

type TTilePrice = {
  isLoading: boolean;
  value: string;
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

  const [ipTypeOption, setIpTypeOption] = useState<TIpTypeOption>();

  const { isCreateEditBasicIpEnabled } = useCreateEditBasicIp();

  const ipTypeOptions: TIpTypeOption[] = [
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
    ...(isCreateEditBasicIpEnabled
      ? [
          {
            name: t('pci_additional_ip_basic_ip'),
            description: t('pci_additional_ip_basic_ip_description'),
            type: PublicIp.BASIC,
          },
        ]
      : []),
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

  const {
    cheapestPrice: basicIpPrice,
    hasPriceVariation: hasBasicIpPriceVariation,
    isFetching: isBasicIpFetching,
  } = useBasicIpCatalog(projectId);

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const selectIpType = (value: TIpTypeOption) => {
    setIpTypeOption(value);
    setForm({ ...form, ipType: value.type });
  };

  const prices = useMemo<Record<PublicIp, TTilePrice>>(() => {
    const fromPrice = (price: number, isCheapestOfSeveral: boolean) =>
      isCheapestOfSeveral
        ? `${t(
            'pci_floating_ip_price_per_hour',
          )} ${getFormattedHourlyCatalogPrice(price)}`
        : getFormattedHourlyCatalogPrice(price);

    return {
      [PublicIp.FAILOVER]: {
        isLoading: isFailoverFetching,
        value: t('pci_additional_ip_price_per_month', {
          price: failoverIp?.details.pricings.default[0].price.text,
        }),
      },
      [PublicIp.FLOATING]: {
        isLoading: isFloatingIpFetching,
        // if there is only one product it means there is only one price
        value: fromPrice(floatingIp[0]?.price, floatingIp.length > 1),
      },
      [PublicIp.BASIC]: {
        isLoading: isBasicIpFetching,
        value: fromPrice(basicIpPrice, hasBasicIpPriceVariation),
      },
    };
  }, [
    t,
    getFormattedHourlyCatalogPrice,
    failoverIp,
    isFailoverFetching,
    floatingIp,
    isFloatingIpFetching,
    basicIpPrice,
    hasBasicIpPriceVariation,
    isBasicIpFetching,
  ]);

  return (
    <StepComponent
      {...steps.get(StepIdsEnum.IP_TYPE)}
      title={t('pci_additional_ip_create_step_select_ip')}
      next={ipTypeOption ? { action: On.next } : {}}
      showDisabledAction
      onEdit={On.edit}
      order={1}
    >
      <TilesInputComponent<TIpTypeOption>
        items={ipTypeOptions}
        value={ipTypeOption}
        label={({ name, description, type }) => (
          <TileLabel title={name} description={description}>
            <div className="text-sm mt-4 text-center font-bold">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                <PriceLabel
                  isLoading={prices[type].isLoading}
                  value={prices[type].value}
                  className="font-bold"
                />
              </OsdsText>
            </div>
          </TileLabel>
        )}
        onInput={selectIpType}
      />
    </StepComponent>
  );
};
