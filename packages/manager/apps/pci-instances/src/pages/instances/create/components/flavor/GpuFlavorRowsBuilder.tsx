import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { DiskDisplayCell } from '@/pages/instances/create/components/cart/DiskDisplayCell.component';
import { TGpuFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';
import { ReactNode } from 'react';

type FlavorRenderers = {
  renderName: (flavor: TGpuFlavorDataForTable) => ReactNode;
  renderRadio: (id: string, disabled?: boolean) => ReactNode;
  renderHourlyPrice: (value: number | null) => ReactNode;
  renderMonthlyPrice: (
    realMinimumMonthlyPrice: number | null,
    estimatedMinimumMonthlyPrice: number | null,
  ) => ReactNode;
};

export function GpuFlavorRowsBuilder(
  flavors: TGpuFlavorDataForTable[],
  {
    renderName,
    renderRadio,
    renderMonthlyPrice,
    renderHourlyPrice,
  }: FlavorRenderers,
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
        disabled: flavor.unavailableQuota || flavor.hasNoAvailableRegions,
        action: renderRadio(flavor.id, flavor.unavailableQuota || flavor.hasNoAvailableRegions),
        name: renderName(flavor),
        gpu: <Text preset={TEXT_PRESET.span}>{flavor.gpu}</Text>,
        numberOfGpu: (
          <Text preset={TEXT_PRESET.span}>{flavor.numberOfGpu}</Text>
        ),
        vRamTotal: <Text preset={TEXT_PRESET.span}>{flavor.vRamTotal}</Text>,
        memory: <Text preset={TEXT_PRESET.span}>{flavor.memory}</Text>,
        vCore: <Text preset={TEXT_PRESET.span}>{flavor.vCore}</Text>,
        disks: (
          <div className="flex flex-col">
            {flavor.disks.map((disk) => (
              <Text key={disk.id} preset={TEXT_PRESET.span}>
                <DiskDisplayCell disk={disk} />
              </Text>
            ))}
          </div>
        ),
        prices: (
          <div className="flex flex-col">
            <Text preset={TEXT_PRESET.span} className="font-semibold">
              {flavor.realMinimumHourlyPrice &&
                renderHourlyPrice(flavor.realMinimumHourlyPrice)}
            </Text>
            <Text preset={TEXT_PRESET.span}>
              {renderMonthlyPrice(
                flavor.realMinimumMonthlyPrice,
                flavor.estimatedMinimumMonthlyPrice,
              )}
            </Text>
          </div>
        ),
      };
    });
}
