import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet, useLoaderData } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { fetchNashaList, SELECTED_NAS } from '../api/nasha-react-app/index';

const queryClient = new QueryClient();

function Services() {
  const { isLoading, isError, data } = useQuery('listNasha', fetchNashaList);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  const count = data.length;
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
      <hr />
      <h1>{SELECTED_NAS}</h1>
      <h2>Informations générales</h2>
      <h2>Partitions</h2>
      <div>
        <h3>Informations</h3>
        <h3>Configuration</h3>
        <h3>Abonnement</h3>
      </div>
    </>
  );
}

export default function NashaReactApp() {
  const { t } = useTranslation('nasha-react-app');
  const data = useLoaderData() as Record<string, unknown>;

  return (
    <div>
      <h1>{t('title')}</h1>
      <QueryClientProvider client={queryClient}>
        <Services />
      </QueryClientProvider>
    </div>
  );
}
