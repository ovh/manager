import React from 'react';

import { OdsMessage, OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';

import { useVcdDatacentres } from '@ovh-ux/manager-module-vcd-api';

import { useOrganisationParams } from '@/hooks/params/useSafeParams';

export const DatacentresCount: React.FC = () => {
  const { id } = useOrganisationParams();
  const { data: vDatacentres, isError, error, isLoading } = useVcdDatacentres(id);

  if (isError) {
    return <OdsMessage color="danger">{error?.response?.data?.message}</OdsMessage>;
  }

  return isLoading ? <OdsSkeleton /> : <OdsText>{vDatacentres?.data?.length.toString()}</OdsText>;
};

export default DatacentresCount;
