import React from 'react';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';

export type ResourceLocationCellProps = {
  region: string;
};

export const ResourceLocationCell = ({ region }: ResourceLocationCellProps) => {
  const { data, isLoading, isError } = useLocationDetails(region);

  if (isLoading) return <OdsSkeleton className="w-full" />;
  if (isError) return <DataGridTextCell>{region}</DataGridTextCell>;

  return <DataGridTextCell>{data?.location}</DataGridTextCell>;
};
