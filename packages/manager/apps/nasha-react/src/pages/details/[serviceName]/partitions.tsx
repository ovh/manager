import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-stencil/components/react/';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getPartition } from '../../../api/nasha-react';

import NotFound from '../../404';

function Partitions(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['partitions', { serviceName }],
    getPartition,
  );
  const { t } = useTranslation('nasha-react/details/dashboard');
  if (isLoading) {
    return <OsdsSpinner />;
  }

  if (isError) {
    return <NotFound />;
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }
  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
    </>
  );
}

export default Partitions;
