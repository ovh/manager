import { BADGE_SIZE, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';
import { ReactNode } from 'react';

type FlavorRenderers = {
  renderName: (flavor: TFlavorDataForTable) => ReactNode;
  renderRadio: (id: string, disabled?: boolean) => ReactNode;
  renderHourlyPrice: (value: number | null) => ReactNode;
  renderMonthlyPrice: (
    realMinimumMonthlyPrice: number | null,
    estimatedMinimumMonthlyPrice: number | null,
  ) => ReactNode;
};

export const FlavorRowsBuilder = (
  flavors: TFlavorDataForTable[],
  {
    renderName,
    renderRadio,
    renderHourlyPrice,
    renderMonthlyPrice,
  }: FlavorRenderers,
  withUnavailable: boolean,
): TableRow[] => {
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
        memory: <Text preset={TEXT_PRESET.span}>{flavor.memory}</Text>,
        vCore: <Text preset={TEXT_PRESET.span}>{flavor.vCore}</Text>,
        disks: (
          <div className="flex flex-col">
            {flavor.disks.map((disk) => (
              <Text key={disk.id} preset={TEXT_PRESET.span}>
                {disk.display}
              </Text>
            ))}
          </div>
        ),
        mode: flavor.mode ? (
          <DeploymentModeBadge mode={flavor.mode} size={BADGE_SIZE.sm} />
        ) : (
          <Text preset={TEXT_PRESET.span} className="font-semibold">
            -
          </Text>
        ),
        hourlyPrice: renderHourlyPrice(flavor.realMinimumHourlyPrice),
        monthlyPrice: renderMonthlyPrice(
          flavor.realMinimumMonthlyPrice,
          flavor.estimatedMinimumMonthlyPrice,
        ),
      };
    });
};
