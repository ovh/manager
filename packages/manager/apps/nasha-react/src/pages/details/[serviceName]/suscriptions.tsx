import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { serviceInfos } from '../../../api/nasha-react';

function Subscriptions(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos', { serviceName }],
    serviceInfos,
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
      <ul>
        <button>Configurer le renouvellement</button>
        <button>Anticiper le paiement</button>
        <button>Configurer le renouvellement</button>
      </ul>
    </>
  );
}

export default Subscriptions;
