import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPartition } from '../../../api/nasha-react';
import NotFound from '../../404';

function Partitions(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['partitions', { serviceName }],
    getPartition,
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return NotFound;
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
