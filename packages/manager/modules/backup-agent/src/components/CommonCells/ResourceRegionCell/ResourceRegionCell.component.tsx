import React from 'react';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';

export type ResourceRegionCellProps = {
  region: string;
};

export const ResourceRegionCell = ({ region }: ResourceRegionCellProps) => {
  const { data, isPending, isError } = useLocationDetails(region);

  if (isPending) return <OdsSkeleton className="w-full" />;
  if (isError) return <DataGridTextCell>{region}</DataGridTextCell>;

  return <DataGridTextCell>{data?.name}</DataGridTextCell>;
};
