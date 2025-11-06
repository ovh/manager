import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxGroupItem,
  ComboboxProp,
  ComboboxValueChangeDetails,
  FormField,
  FormFieldLabel,
  Message,
  MessageBody,
  MessageIcon,
  Text,
} from '@ovhcloud/ods-react';

import { RegionChipByType } from '@ovh-ux/manager-pci-common';
import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

import { ContinentRegion } from '@/api/hooks/order/order';

interface DistantBackupProps {
  distantContinents: Map<string, ContinentRegion[]>;
  distantRegion: string;
  onChange: (distantRegion: string | null) => void;
}

export const DistantBackup: FC<DistantBackupProps> = ({
  distantContinents,
  distantRegion,
  onChange,
}) => {
  const { t } = useTranslation(['workflow-add', 'pci-common', 'global']);

  const { getFormattedCatalogPrice } = useCatalogPrice(3, {
    hideTaxLabel: true,
  });

  const distantContinentsComboboxItems = useMemo<ComboboxGroupItem[]>(
    () =>
      Array.from(distantContinents.entries()).map(([continent, regions]) => ({
        label: continent,
        options: regions.map((region) => ({
          label: region.label,
          value: region.name,
        })),
      })),
    [distantContinents],
  );

  const comboboxRegionRender = useMemo<ComboboxProp['customOptionRenderer']>(() => {
    const regionsById = new Map(
      Array.from(distantContinents.values()).flatMap((regions) => regions.map((r) => [r.name, r])),
    );

    // Not a React component
    // eslint-disable-next-line react/display-name
    return (item) =>
      'options' in item ? (
        <span>{item.label}</span>
      ) : (
        <div className={'flex flex-row justify-between w-full'}>
          <span>{item.label}</span>
          {regionsById.has(item.value) && (
            <span>
              <RegionChipByType type={regionsById.get(item.value).type} showTooltip={false} />
            </span>
          )}
        </div>
      );
  }, [distantContinents]);

  const showActivateRegionWarning = useMemo(
    () =>
      !!distantRegion &&
      !!Array.from(distantContinents.values()).find(
        (regions) => regions.find((r) => r.name === distantRegion)?.enabled === false,
      ),
    [distantRegion, distantContinents],
  );

  const distantRegionPrice = useMemo(() => {
    const region = new Map(
      Array.from(distantContinents.values()).flatMap((regions) => regions.map((r) => [r.name, r])),
    ).get(distantRegion);

    return region?.price
      ? getFormattedCatalogPrice(convertHourlyPriceToMonthly(region.price))
      : null;
  }, [distantRegion, distantContinents, getFormattedCatalogPrice]);

  const handleDistantRegionChange = (changeDetails: ComboboxValueChangeDetails) =>
    onChange(changeDetails.value[0] ?? null);

  return (
    <div className={'mt-5'}>
      <FormField>
        <FormFieldLabel>{t('pci_workflow_create_distant_region_label')}</FormFieldLabel>

        <Combobox
          customOptionRenderer={comboboxRegionRender}
          items={distantContinentsComboboxItems}
          value={distantRegion ? [distantRegion] : []}
          onValueChange={handleDistantRegionChange}
          className="max-w-[360px]"
          allowCustomValue={false}
        >
          <ComboboxControl clearable />
          <ComboboxContent className="max-h-52 overflow-y-scroll" />
        </Combobox>
      </FormField>

      {distantRegion && (
        <div className="mt-5">
          <Text>
            {t('pci_workflow_create_price_title')}
            <span className="font-bold">
              {distantRegionPrice
                ? t('pci_workflow_create_price_monthly', {
                    price: distantRegionPrice,
                  })
                : t('pci_workflow_create_price_not_available')}
            </span>
          </Text>
        </div>
      )}

      {showActivateRegionWarning && (
        <Message className={'mt-6'} color={'warning'} dismissible={false}>
          <MessageIcon name={'triangle-exclamation'} />
          <MessageBody>{t('pci_workflow_create_distant_region_enable_warning')}</MessageBody>
        </Message>
      )}
    </div>
  );
};
