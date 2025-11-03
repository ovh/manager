import { BADGE_SIZE, Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { TableRow } from '@/components/flavorsTable/FlavorsTable.component';
import { DeploymentModeBadge } from '@/components/deploymentModeBadge/DeploymentModeBadge.component';
import { TFlavorDataForTable } from '@/pages/instances/create/view-models/flavorsViewModel';
import { ReactNode } from 'react';

type FlavorRenderers = {
  renderName: (flavor: TFlavorDataForTable) => ReactNode;
  renderRadio: (id: string, disabled?: boolean) => ReactNode;
};

export function FlavorRowsBuilder(
  flavors: TFlavorDataForTable[],
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
        memory: <Text preset={TEXT_PRESET.span}>{flavor.memory}</Text>,
        vCore: <Text preset={TEXT_PRESET.span}>{flavor.vCore}</Text>,
        storage: <Text preset={TEXT_PRESET.span}>{flavor.storage}</Text>,
        mode: <DeploymentModeBadge mode={flavor.mode} size={BADGE_SIZE.sm} />,
        hourlyPrice: (
          <Text preset={TEXT_PRESET.span} className="font-semibold">
            {flavor.hourlyPrice?.toFixed(4)} €
          </Text>
        ),
        monthlyPrice: (
          <Text preset={TEXT_PRESET.span} className="font-semibold">
            {flavor.monthlyPrice?.toFixed(2)} € *
          </Text>
        ),
      };
    });
}
