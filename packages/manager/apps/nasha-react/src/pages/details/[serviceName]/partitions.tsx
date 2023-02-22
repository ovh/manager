import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNashaPartition } from '../../../api/nasha-react';

function Partitions(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['partitions', { serviceName }],
    fetchNashaPartition,
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
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
