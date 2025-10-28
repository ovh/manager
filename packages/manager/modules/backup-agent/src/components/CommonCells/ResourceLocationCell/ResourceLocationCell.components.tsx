import React from 'react';

import { OdsSkeleton } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useLocationDetails } from '@/data/hooks/location/getLocationDetails';
import {ResourceWithAzName} from "@/types/Resource.type";

export const ResourceLocationCell = (resource: ResourceWithAzName) => {
  const { data, isLoading, isError } = useLocationDetails(resource.currentState.azName);

  if (isLoading) return <OdsSkeleton className="w-full" />;
  if (isError) return <DataGridTextCell>{resource.currentState.azName}</DataGridTextCell>;

  return <DataGridTextCell>{data?.location}</DataGridTextCell>;
};
