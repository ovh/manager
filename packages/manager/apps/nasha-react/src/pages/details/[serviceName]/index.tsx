import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {
  fetchNashaDetails,
  fetchNashaPartition,
  fetchNashaServiceInfos,
} from '../../../api/nasha-react';

const queryClient = new QueryClient();

function Partition(props: { serviceName: string }) {
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

function Informations(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    fetchNashaDetails,
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
        <input type="text" value={data.serviceName} />
        <button>Modifier</button>
      </ul>
    </>
  );
}

function Configuration(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    fetchNashaDetails,
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
      <ul>
        {data.use.used.value} / {data.use.size.value} {data.use.size.unit}
      </ul>
      <ul>
        <button>Créer une partition</button>
      </ul>
    </>
  );
}

function Abonnement(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos', { serviceName }],
    fetchNashaServiceInfos,
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

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div>
      <Heading as="h3" size="sm">
        {t('title')}
        <QueryClientProvider client={queryClient}>
          <hr />
          <h2>Informations générales</h2>
          <div>
            <h3>Partitions</h3>
            <Partition serviceName={serviceName} />
            <h3>Informations</h3>
            <Informations serviceName={serviceName} />
            <h3>Configuration</h3>
            <Configuration serviceName={serviceName} />
            <h3>Abonnement</h3>
            <Abonnement serviceName={serviceName} />
          </div>
        </QueryClientProvider>
      </Heading>
    </div>
  );
}
