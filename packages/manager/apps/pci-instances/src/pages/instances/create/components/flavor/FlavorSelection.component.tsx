import {
  Controller,
  ControllerRenderProps,
  useFormContext,
} from 'react-hook-form';
import { RadioGroup, SelectGroupItem, Text } from '@ovhcloud/ods-react';
import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FlavorsTable } from '@/components/flavorsTable/FlavorsTable.component';
import {
  mockedFlavors,
  mockedGpuFlavors,
  mockedFlavorAvailableRegions,
} from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';
import { GpuFlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorColumnsBuilder';
import { GpuFlavorRowsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorRowsBuilder';
import { useMemo } from 'react';
import { useFlavorCommon } from '@/pages/instances/create/components/flavor/FlavorRowUtils';
import {
  mapFlavorToTable,
  mapGpuFlavorToTable,
  TFlavorDataForTable,
  TGpuFlavorDataForTable,
} from '@/pages/instances/create/view-models/flavorsViewModel';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import RegionSelectionModal, {
  TCustomRegionItemData,
  TCustomRegionSelected,
} from '../RegionSelectionModal.component';

export const FlavorSelection: FC<{ withUnavailable: boolean }> = ({
  withUnavailable,
}) => {
  const { t } = useTranslation('creation');
  const { control, getValues, setValue } = useFormContext<
    TInstanceCreationForm
  >();
  const flavorType = getValues('flavorCategory');
  const { renderName, renderRadio } = useFlavorCommon();
  const [unavailableFlavor, setUnavailableFlavor] = useState<string | null>(
    null,
  );
  const { trackClick } = useOvhTracking();

  const flavorData = useMemo(() => {
    if (flavorType === 'Cloud GPU') {
      return mockedGpuFlavors.map(mapGpuFlavorToTable);
    }
    return mockedFlavors.map(mapFlavorToTable);
  }, [flavorType]);

  const { columns, rows } = useMemo(() => {
    if (flavorType === 'Cloud GPU') {
      const gpuFlavors = flavorData as TGpuFlavorDataForTable[];
      return {
        columns: GpuFlavorColumnsBuilder(t),
        rows: GpuFlavorRowsBuilder(
          gpuFlavors,
          { renderName, renderRadio },
          withUnavailable,
        ),
      };
    }

    const flavors = flavorData as TFlavorDataForTable[];
    return {
      columns: FlavorColumnsBuilder(t),
      rows: FlavorRowsBuilder(
        flavors,
        { renderName, renderRadio },
        withUnavailable,
      ),
    };
  }, [flavorType, flavorData, renderName, renderRadio, t, withUnavailable]);

  // TODO: will be moved to a select view-model
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

    const flavor = flavorData.find(({ name }) => name === flavorName);

    field.onChange(flavorName);

    if (flavor?.unavailable) {
      setUnavailableFlavor(flavorName);
    } else {
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.tile,
        actionType: 'action',
        actions: [
          'add_instance',
          'flavor_type',
          flavorType ?? '',
          'model',
          flavorName,
        ],
      });
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
              selectedRowId={field.value}
              onRowClick={(flavorName) => handleSelect(field, flavorName)}
            />
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
