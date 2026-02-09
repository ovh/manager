import React from 'react';

import { useQuery } from '@tanstack/react-query';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { locationsQueries } from '@/data/queries/locations.queries';

export type ResourceLocationCellProps = {
  region: string;
};

export const ResourceLocationCell = ({ region }: ResourceLocationCellProps) => {
  const { data, isPending, isError } = useQuery(locationsQueries.detail(region));

  if (isPending) return <OdsSkeleton className="w-full" />;
  if (isError) return <DataGridTextCell>{region}</DataGridTextCell>;

  return <DataGridTextCell>{data?.location}</DataGridTextCell>;
};
