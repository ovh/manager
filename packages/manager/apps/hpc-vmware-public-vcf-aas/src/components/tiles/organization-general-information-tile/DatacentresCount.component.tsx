import React from 'react';
import { useParams } from 'react-router-dom';
import {
  OdsSkeleton,
  OdsText,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useVcdDatacentres } from '@ovh-ux/manager-module-vcd-api';

export const DatacentresCount: React.FC = () => {
  const { id } = useParams();
  const { data: vDatacentres, isError, error, isLoading } = useVcdDatacentres(
    id,
  );

  if (isError) {
    return (
      <OdsMessage color="danger">{error?.response?.data?.message}</OdsMessage>
    );
  }

  return isLoading ? (
    <OdsSkeleton />
  ) : (
    <OdsText>{vDatacentres?.data?.length.toString()}</OdsText>
  );
};

export default DatacentresCount;
