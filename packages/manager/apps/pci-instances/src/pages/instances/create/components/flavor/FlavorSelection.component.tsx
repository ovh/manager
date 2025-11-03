import { RadioGroup, SelectGroupItem, Text } from '@ovhcloud/ods-react';
import { FC, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { FlavorsTable } from '@/components/flavorsTable/FlavorsTable.component';
import { mockedFlavorAvailableRegions } from '@/__mocks__/instance/constants';
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';
import { GpuFlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorColumnsBuilder';
import { GpuFlavorRowsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorRowsBuilder';
import { useFlavorCommon } from '@/pages/instances/create/components/flavor/FlavorRowUtils';
import { TGpuFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import RegionSelectionModal, {
  TCustomRegionItemData,
  TCustomRegionSelected,
} from '../RegionSelectionModal.component';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { selectFlavors } from '../../view-models/flavorsViewModel';
import { useEffect } from 'react';

export const FlavorSelection: FC<{ withUnavailable: boolean }> = ({
  withUnavailable,
}) => {
  const projectId = useProjectId();
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [flavorCategory, flavorType, microRegion, flavorId] = useWatch({
    control,
    name: ['flavorCategory', 'flavorType', 'microRegion', 'flavorId'],
  });

  const { renderName, renderRadio } = useFlavorCommon();
  const [unavailableFlavor, setUnavailableFlavor] = useState<string | null>(
    null,
  );
  const { trackClick } = useOvhTracking();

  const flavorsData = useMemo(
    () => selectFlavors(deps)(projectId, flavorType, microRegion),
    [flavorType, microRegion, projectId],
  );

  const { columns, rows } = useMemo(() => {
    if (flavorCategory === 'Cloud GPU') {
      // TODO: will be changed in future PR
      const gpuFlavors = (flavorsData as unknown) as TGpuFlavorDataForTable[];
      return {
        columns: GpuFlavorColumnsBuilder(t),
        rows: GpuFlavorRowsBuilder(
          gpuFlavors,
          { renderName, renderRadio },
          withUnavailable,
        ),
      };
    }

    const flavors = flavorsData;
    return {
      columns: FlavorColumnsBuilder(t),
      rows: FlavorRowsBuilder(
        flavors,
        { renderName, renderRadio },
        withUnavailable,
      ),
    };
  }, [
    flavorCategory,
    flavorsData,
    renderName,
    renderRadio,
    t,
    withUnavailable,
  ]);

  // TODO: will be moved to a select view-model
  const items: SelectGroupItem<
    TCustomRegionItemData
  >[] = mockedFlavorAvailableRegions as SelectGroupItem<
    TCustomRegionItemData
  >[];

  const handleCloseSelectRegion = () => setUnavailableFlavor(null);

  const handleSelect = (
    field: ControllerRenderProps<TInstanceCreationForm, 'flavorId'>,
    flavorId: string | null,
  ) => {
    if (!flavorId) return;

    const flavor = flavorsData.find(({ id }) => id === flavorId);

    field.onChange(flavorId);

    if (flavor?.unavailable) {
      setUnavailableFlavor(flavor.name);
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
          flavorId,
        ],
      });
    }
  };

  const handleSelectFlavorNewRegion = ({
    macroRegion,
    microRegion,
  }: TCustomRegionSelected) => {
    setValue('flavorId', unavailableFlavor);
    setValue('macroRegion', macroRegion);
    setValue('microRegion', microRegion);
    setValue('deploymentModes', ['region', 'region-3-az', 'localzone']);
    setValue('continent', 'all');
    setValue('availabilityZone', null);
  };

  useEffect(() => {
    const availablePreviousSelectedFlavor = flavorsData.find(
      (flavor) => flavor.id === flavorId,
    );

    if (!availablePreviousSelectedFlavor && flavorsData[0]?.id) {
      setValue('flavorId', flavorsData[0].id);
    }
  }, [flavorId, flavorsData, setValue]);

  return (
    <section className="mt-8">
      <Controller
        name="flavorId"
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
              onRowClick={(flavorId) => handleSelect(field, flavorId)}
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
