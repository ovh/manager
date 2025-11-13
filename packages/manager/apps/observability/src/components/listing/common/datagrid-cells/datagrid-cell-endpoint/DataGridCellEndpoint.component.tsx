import { Link, Skeleton, TEXT_PRESET, Text } from '@ovh-ux/muk';

import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';

import { DatagridCellEnpointProps } from './DataGridCellEndpoint.props';

export default function DatagridCellEnpoint({
  infrastructure,
}: DatagridCellEnpointProps): JSX.Element {
  const { data: locationDetails, isLoading } = useLocation(
    infrastructure?.currentState.location ?? '',
  );

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
        {infrastructure.currentState.entryPoint}
      </Link>
      <Text preset={TEXT_PRESET.span}>{locationDetails?.location ?? '--'}</Text>
    </div>
  ) : (
    <></>
  );
}
