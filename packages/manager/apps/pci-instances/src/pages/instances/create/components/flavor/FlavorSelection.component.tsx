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
import { FlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/FlavorColumnsBuilder';
import { FlavorRowsBuilder } from '@/pages/instances/create/components/flavor/FlavorRowsBuilder';
import { GpuFlavorColumnsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorColumnsBuilder';
import { GpuFlavorRowsBuilder } from '@/pages/instances/create/components/flavor/GpuFlavorRowsBuilder';
import { useFlavorCommon } from '@/pages/instances/create/components/flavor/FlavorRowUtils';
import {
  selectAvailableFlavorMicroRegions,
  selectFlavors,
  TCustomRegionItemData,
} from '@/pages/instances/create/view-models/flavorsViewModel';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import RegionSelectionModal, {
  TCustomRegionSelected,
} from '../RegionSelectionModal.component';
import { deps } from '@/deps/deps';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useEffect } from 'react';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { selectBillingTypes } from '../../view-models/BillingTypesViewModel';

export const FlavorSelection: FC<{ withUnavailable: boolean }> = ({
  withUnavailable,
}) => {
  const projectId = useProjectId();
  const { t } = useTranslation(['creation']);
  const { control, setValue, resetField } = useFormContext<
    TInstanceCreationForm
  >();
  const [
    flavorCategory,
    flavorType,
    microRegion,
    flavorId,
    osType,
    billingType,
  ] = useWatch({
    control,
    name: [
      'flavorCategory',
      'flavorType',
      'microRegion',
      'flavorId',
      'distributionImageOsType',
      'billingType',
    ],
  });
  const flavorAvailableBillingTypes = useMemo(
    () => selectBillingTypes(deps)(projectId, flavorId, osType),
    [projectId, flavorId, osType],
  );

  const {
    renderName,
    renderRadio,
    renderHourlyPrice,
    renderMonthlyPrice,
  } = useFlavorCommon();
  const [unavailableFlavor, setUnavailableFlavor] = useState<string | null>(
    null,
  );
  const { trackClick } = useOvhTracking();

  const { flavors, preselectedFlavordId, isGpu } = useMemo(
    () =>
      selectFlavors(deps)({
        projectId,
        flavorCategory,
        flavorType,
        microRegionId: microRegion,
        withUnavailable,
      }),
    [flavorCategory, flavorType, microRegion, projectId, withUnavailable],
  );

  const { columns, rows } = useMemo(() => {
    if (isGpu) {
      return {
        columns: GpuFlavorColumnsBuilder(t),
        rows: GpuFlavorRowsBuilder(
          flavors,
          { renderName, renderRadio, renderHourlyPrice, renderMonthlyPrice },
          withUnavailable,
        ),
      };
    }

    return {
      columns: FlavorColumnsBuilder(t),
      rows: FlavorRowsBuilder(
        flavors,
        { renderName, renderRadio, renderHourlyPrice, renderMonthlyPrice },
        withUnavailable,
      ),
    };
  }, [
    isGpu,
    flavors,
    renderName,
    renderRadio,
    renderHourlyPrice,
    renderMonthlyPrice,
    t,
    withUnavailable,
  ]);

  const availableRegions = useMemo(
    () =>
      selectAvailableFlavorMicroRegions(deps)({
        projectId,
        unavailableFlavor,
      }),
    [unavailableFlavor, projectId],
  ) as SelectGroupItem<TCustomRegionItemData>[];

  const handleCloseSelectRegion = () => setUnavailableFlavor(null);

  const resetQuantity = () => setValue('quantity', 1);

  const handleSelect = (
    field: ControllerRenderProps<TInstanceCreationForm, 'flavorId'>,
    flavorId: string | null,
  ) => {
    if (!flavorId) return;

    const flavor = flavors.find(({ id }) => id === flavorId);
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
    resetQuantity();
  };

  const handleSelectFlavorNewRegion = ({
    macroRegionId,
    microRegionId,
    regionalizedFlavorId,
  }: TCustomRegionSelected) => {
    setValue('flavorId', regionalizedFlavorId);
    setValue('macroRegion', macroRegionId);
    setValue('microRegion', microRegionId);
    setValue('deploymentModes', ['region', 'region-3-az', 'localzone']);
    setValue('continent', 'all');
    setValue('availabilityZone', null);
  };

  useEffect(() => {
    const availablePreviousSelectedFlavor = flavors.find(
      (flavor) => flavor.id === flavorId,
    );

    if (!availablePreviousSelectedFlavor) {
      setValue('flavorId', preselectedFlavordId);
    }
  }, [flavorId, flavors, preselectedFlavordId, setValue]);

  useEffect(() => {
    const hasPreviousSelectedBilling = flavorAvailableBillingTypes.some(
      (billingChoice) => billingChoice === billingType,
    );

    if (!hasPreviousSelectedBilling) resetField('billingType');
  }, [billingType, flavorAvailableBillingTypes, resetField]);

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
              caption={t('creation:pci_instance_creation_select_flavor_title')}
              selectable
              selectedRowId={field.value}
              onRowClick={(flavorId) => handleSelect(field, flavorId)}
              emptyMessage={t('creation:pci_instance_creation_flavor_no_results')}
            />
          </RadioGroup>
        )}
      />
      <RegionSelectionModal
        open={!!unavailableFlavor && availableRegions.length > 0}
        regions={availableRegions}
        onClose={handleCloseSelectRegion}
        onValidateSelect={handleSelectFlavorNewRegion}
      >
        <Text preset="paragraph">
          <Trans
            t={t}
            i18nKey="creation:pci_instance_creation_select_new_region_for_flavor"
            values={{ flavor: unavailableFlavor }}
            tOptions={{ interpolation: { escapeValue: true } }}
          />
        </Text>
      </RegionSelectionModal>
    </section>
  );
};
