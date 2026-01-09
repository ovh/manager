import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { TGpuFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';
import { ReactNode } from 'react';

type FlavorRenderers = {
  renderName: (flavor: TGpuFlavorDataForTable) => ReactNode;
  renderRadio: (id: string, disabled?: boolean) => ReactNode;
};

export function GpuFlavorRowsBuilder(
  flavors: TGpuFlavorDataForTable[],
  { renderName, renderRadio }: FlavorRenderers,
  withUnavailable: boolean,
): TableRow[] {
  return flavors
    .filter(
      ({ unavailable, unavailableQuota }) =>
        withUnavailable || !(unavailable || unavailableQuota),
    )
    .map((flavor) => {
      return {
        id: flavor.id,
        disabled: flavor.unavailableQuota,
        action: renderRadio(flavor.id, flavor.unavailableQuota),
        name: renderName(flavor),
        gpu: <Text preset={TEXT_PRESET.span}>{flavor.gpu}</Text>,
        numberOfGpu: (
          <Text preset={TEXT_PRESET.span}>{flavor.numberOfGpu}</Text>
        ),
        vRamTotal: <Text preset={TEXT_PRESET.span}>{flavor.vRamTotal}</Text>,
        memory: <Text preset={TEXT_PRESET.span}>{flavor.memory}</Text>,
        vCore: <Text preset={TEXT_PRESET.span}>{flavor.vCore}</Text>,
        storage: <Text preset={TEXT_PRESET.span}>{flavor.storage}</Text>,
        prices: (
          <div className="flex flex-col">
            <Text preset={TEXT_PRESET.span} className="font-semibold">
              {flavor.hourlyPrice ? `${flavor.hourlyPrice.toFixed(4)} €` : '-'}
            </Text>
            <Text preset={TEXT_PRESET.span}>
              {flavor.monthlyPrice
                ? `~ ${flavor.monthlyPrice.toFixed(2)} €`
                : '-'}
            </Text>
          </div>
        ),
      };
    });
}
