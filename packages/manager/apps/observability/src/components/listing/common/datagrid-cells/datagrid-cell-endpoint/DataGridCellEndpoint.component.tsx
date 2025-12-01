import { Skeleton } from '@ovhcloud/ods-react';
import { Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { DatagridCellEnpointProps } from '@/components/listing/common/datagrid-cells/datagrid-cell-endpoint/DataGridCellEndpoint.props';
import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';

export default function DatagridCellEnpoint({
  infrastructure,
}: DatagridCellEnpointProps): JSX.Element {
  const { data: locationDetails, isLoading } = useLocation(infrastructure?.location ?? '');

  if (isLoading) {
    return <Skeleton />;
  }

  return infrastructure ? (
    <div className="flex flex-col">
      <Link
        className="leading-normal"
        href="#"
        data-testid={`tenant-cell-endpoint-link-${infrastructure.id}`}
      >
        {infrastructure.entryPoint}
      </Link>
      <Text preset={TEXT_PRESET.small}>{locationDetails?.location ?? '--'}</Text>
    </div>
  ) : (
    <></>
  );
}
