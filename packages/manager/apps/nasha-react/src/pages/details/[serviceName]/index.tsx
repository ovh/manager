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

  return (
    <>
      Partitions {props.serviceName}
      <div>{JSON.stringify(data)}</div>
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
    return <Navigate to="onboarding" />;
  }
  if (count === 1) {
    return (
      <>
        <Outlet />
        <Navigate to={data[0]} />
      </>
    );
  }
  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
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
    return <Navigate to="onboarding" />;
  }
  if (count === 1) {
    return (
      <>
        <Outlet />
        <Navigate to={data[0]} />
      </>
    );
  }
  return (
    <>
      <ul>
        {data.use.used.value} / {data.use.size.value} {data.use.size.unit}
      </ul>
    </>
  );
}

function ServicesInfo(props: { serviceName: string }) {
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
    return <Navigate to="onboarding" />;
  }
  if (count === 1) {
    return (
      <>
        <Outlet />
        <Navigate to={data[0]} />
      </>
    );
  }
  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
    </>
  );
}

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div>
      <Heading as="h3" size="sm">
        {t('title')} test branch 2
      </Heading>
      <QueryClientProvider client={queryClient}>
        <hr />
        <h2>Informations générales</h2>
        <h2>Partitions</h2>
        <Partition serviceName={serviceName} />
        <div>
          <h3>Informations</h3>
          <Informations serviceName={serviceName} />
          <h3>Configuration</h3>
          <Configuration serviceName={serviceName} />
          <h3>Abonnement</h3>
          <ServicesInfo serviceName={serviceName} />
        </div>
      </QueryClientProvider>
    </div>
  );
}
