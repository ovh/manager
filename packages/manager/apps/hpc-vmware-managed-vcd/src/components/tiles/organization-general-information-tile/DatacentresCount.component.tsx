import React from 'react';
import { Description } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { OsdsSkeleton, OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE, ODS_SKELETON_SIZE } from '@ovhcloud/ods-components';
import { useVcdDatacentres } from '@ovh-ux/manager-module-vcd-api';

export const DatacentresCount: React.FC = () => {
  const { id } = useParams();
  const { data: vDatacentres, isError, error, isLoading } = useVcdDatacentres(
    id,
  );

  if (isError) {
    return (
      <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
        {error?.response?.data?.message}
      </OsdsMessage>
    );
  }

  return isLoading ? (
    <OsdsSkeleton size={ODS_SKELETON_SIZE.xs} />
  ) : (
    <Description>{vDatacentres?.data?.length.toString()}</Description>
  );
};

export default DatacentresCount;
