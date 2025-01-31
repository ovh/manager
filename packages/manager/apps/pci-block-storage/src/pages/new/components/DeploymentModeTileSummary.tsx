import { OsdsTile } from '@ovhcloud/ods-components/react';
import { DeploymentModeTile } from '@/pages/new/components/DeploymentModeTile';
import { TCatalogGroup } from '@/api/data/catalog';

interface DeploymentModeTileSummaryProps {
  group: TCatalogGroup;
}

export function DeploymentModeTileSummary({
  group,
}: Readonly<DeploymentModeTileSummaryProps>) {
  return (
    <div className="grid gap-6 p-6 m-0 grid-cols-1 md:grid-cols-3">
      <OsdsTile
        checked
        className="font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]"
      >
        <DeploymentModeTile group={group} />
      </OsdsTile>
    </div>
  );
}
