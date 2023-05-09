import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { fetchIceberg } from '@ovh-ux/manager-core-api/src/iceberg';
import { services } from '../api/nasha-react';

const queryClient = new QueryClient();

// request with iceberg
const NASHA_BASE_API_URL = '/dedicated/nasha';
function getListNashaIceberg() {
  fetchIceberg({ route: NASHA_BASE_API_URL }).then(({ data }) => {
    console.log('NASHA BASE API URL:', NASHA_BASE_API_URL);
    console.log('data:', data);
    return data;
  });
}

function Services() {
  const { isLoading, isError, data } = useQuery(['listNasha'], services);
  // Iceberg à la place
  const listNasha = getListNashaIceberg();
  console.log('listNasha from iceberg:', listNasha);

  const { t } = useTranslation('nasha-react');

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
      <h2>{t('title')}</h2>
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
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Services />
      </QueryClientProvider>
    </div>
  );
}
