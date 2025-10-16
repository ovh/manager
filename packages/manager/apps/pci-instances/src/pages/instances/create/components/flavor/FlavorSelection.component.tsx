import { RadioGroup, SelectGroupItem, Text } from '@ovhcloud/ods-react';
import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import { FlavorsTable } from '@/components/flavorsTable/FlavorsTable.component';
import {
  mockedFlavorAvailableRegions,
  mockedFlavors,
} from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';
import RegionSelectionModal, {
  TCustomRegionItemData,
  TCustomRegionSelected,
} from '../RegionSelectionModal.component';

export const FlavorSelection: FC<{ withUnavailable: boolean }> = ({
  withUnavailable,
}) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [unavailableFlavor, setUnavailableFlavor] = useState<string | null>(
    null,
  );

  const columns = FlavorColumnsBuilder();
  const rows = FlavorRowsBuilder(mockedFlavors, withUnavailable);

  // TODO: will be move to a select view-model
  const items: SelectGroupItem<
    TCustomRegionItemData
  >[] = mockedFlavorAvailableRegions as SelectGroupItem<
    TCustomRegionItemData
  >[];

  const handleCloseSelectRegion = () => setUnavailableFlavor(null);

  const handleSelect = (
    field: ControllerRenderProps<TInstanceCreationForm, 'flavor'>,
    flavorName: string | null,
  ) => {
    if (!flavorName) return;

    const flavor = mockedFlavors.find(({ name }) => name === flavorName);

    if (flavor?.unavailable) {
      setUnavailableFlavor(flavorName);
    } else {
      field.onChange(flavorName);
    }
  };

  const handleSelectFlavorNewRegion = ({
    macroRegion,
    microRegion,
  }: TCustomRegionSelected) => {
    setValue('flavor', unavailableFlavor);
    setValue('macroRegion', macroRegion);
    setValue('microRegion', microRegion);
    setValue('deploymentModes', ['region', 'region-3-az', 'localzone']);
    setValue('continent', 'all');
    setValue('availabilityZone', null);
  };

  return (
    <section className="mt-8">
      <Controller
        name="flavor"
        control={control}
        render={({ field }) => (
          <RadioGroup
            value={field.value ?? undefined}
            onValueChange={(selectedFlavor) =>
              handleSelect(field, selectedFlavor.value)
            }
          >
            <FlavorsTable
              columns={columns}
              rows={rows}
              caption={t('pci_instance_creation_select_flavor_title')}
              selectable
              onRowClick={(flavorName) => handleSelect(field, flavorName)}
            />
            <Text>{t('pci_instance_creation_select_flavor_price_hint')}</Text>
          </RadioGroup>
        )}
      />
      <RegionSelectionModal
        open={!!unavailableFlavor}
        regions={items}
        onClose={handleCloseSelectRegion}
        onValidateSelect={handleSelectFlavorNewRegion}
      >
        <Text preset="paragraph">
          <Trans
            t={t}
            i18nKey="pci_instance_creation_select_new_region_for_flavor"
            values={{ flavor: unavailableFlavor }}
            tOptions={{ interpolation: { escapeValue: true } }}
          />
        </Text>
      </RegionSelectionModal>
    </section>
  );
};
