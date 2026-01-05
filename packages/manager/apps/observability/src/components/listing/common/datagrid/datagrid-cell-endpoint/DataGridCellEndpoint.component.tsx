import { Skeleton } from '@ovhcloud/ods-react';
import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DatagridCellEnpointProps } from '@/components/listing/common/datagrid/datagrid-cell-endpoint/DataGridCellEndpoint.props';
import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';

export default function DatagridCellEnpoint({
  infrastructure,
}: DatagridCellEnpointProps): JSX.Element {
  const { data: locationDetails, isLoading } = useLocation(infrastructure?.location ?? '');

  if (isLoading) {
    return <Skeleton />;
  }

  return infrastructure ? (
    <div className="flex flex-col gap-2">
      <Text preset={TEXT_PRESET.label}>{infrastructure.entryPoint}</Text>
      <Text preset={TEXT_PRESET.small}>{locationDetails?.location ?? '--'}</Text>
    </div>
  ) : (
    <></>
  );
}
