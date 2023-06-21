import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-stencil/components/react/';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getPartition, iamRessources } from '../../../api/nasha-react';

import NotFound from '../../404';

function Partitions(props: { serviceName: string }) {
  // Pour partitions sur 2api
  /* const { serviceName } = props;
   const { isLoading, isError, data } = useQuery(
    ['partitions', { serviceName }],
    getPartition,
  ); */

  // Api v2 IAM
  const { data, isError, isLoading } = useQuery(['ressources'], iamRessources);

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
      {/* 2api <ul>{JSON.stringify(data)}</ul> */}
      <ul>
        {/* API V2 */}
        {JSON.stringify(data[0])}
      </ul>
    </>
  );
}

export default Partitions;
