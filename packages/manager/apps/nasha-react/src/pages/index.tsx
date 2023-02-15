import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet, useLoaderData } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {
  fetchNashaList,
  fetchNashaDetails,
  fetchNashaPartition,
  fetchNashaServiceInfos,
  SELECTED_NAS,
} from '../api/nasha-react';

const queryClient = new QueryClient();

function Services() {
  const { isLoading, isError, data } = useQuery(['listNasha'], fetchNashaList);

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
      <h2>Services list</h2>
      <ul>
        {data.map((serviceName: string) => (
          <li key={serviceName}>
            <Link to={`/details/${serviceName}`}>{serviceName}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function Partition() {
  useQuery(['partitions'], fetchNashaPartition);
  return <>Partitions</>;
}

function Informations() {
  const { isLoading, isError, data } = useQuery(
    ['informations'],
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

function Configuration() {
  const { isLoading, isError, data } = useQuery(
    ['informations'],
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

function ServicesInfo() {
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos'],
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

export default function NashaReactApp() {
  const { t } = useTranslation('nasha-react-app');
  const data = useLoaderData() as Record<string, unknown>;

  return (
    <div>
      <h1>
        {t('NASHA')} - {SELECTED_NAS}
      </h1>
      <QueryClientProvider client={queryClient}>
        <Services />
        <hr />
        <h2>Informations générales</h2>
        <h2>Partitions</h2>
        <Partition />
        <div>
          <h3>Informations</h3>
          <Informations />
          <h3>Configuration</h3>
          <Configuration />
          <h3>Abonnement</h3>
          <ServicesInfo />
        </div>
      </QueryClientProvider>
    </div>
  );
}
