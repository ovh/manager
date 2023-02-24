import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { services } from '../api/nasha-react';

const queryClient = new QueryClient();

function Services() {
  const { isLoading, isError, data } = useQuery(['listNasha'], services);

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

export default function NashaReactApp() {
  const { t } = useTranslation('nasha-react-app');

  return (
    <div>
      <h1>{t('NASHA')}</h1>
      <QueryClientProvider client={queryClient}>
        <Services />
      </QueryClientProvider>
    </div>
  );
}
