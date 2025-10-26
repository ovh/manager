import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { DataGridTextCell, Links } from '@ovh-ux/manager-react-components';

import { useLocation } from '@/data/hooks/infrastructures/useLocations.hook';

import { DatagridCellEnpointProps } from './DataGridCellEndpoint.props';

export default function DatagridCellEnpoint({
  infrastructure,
}: DatagridCellEnpointProps): JSX.Element {
  const { data: locationDetails, isLoading } = useLocation(
    infrastructure?.currentState.location ?? '',
  );

  if (isLoading) {
    return <OdsSkeleton />;
  }

  return infrastructure ? (
    <DataGridTextCell>
      <div className="flex flex-col">
        <Links
          className="leading-normal"
          label={infrastructure.currentState.entryPoint}
          data-testid={`tenant-cell-endpoint-link-${infrastructure.id}`}
        />
        <OdsText preset={ODS_TEXT_PRESET.span}>{locationDetails?.location ?? '--'}</OdsText>
      </div>
    </DataGridTextCell>
  ) : (
    <></>
  );
}
