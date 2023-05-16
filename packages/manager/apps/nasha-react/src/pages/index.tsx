import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { getServices } from '../api/nasha-react';
import Datagrid from '@/components/layout-helpers/list/dataGrid';
import '@ovhcloud/ods-theme-blue-jeans/index.css';

const queryClient = new QueryClient();

function ServiceList({ data }: any) {
  const { t } = useTranslation('nasha-react');

  const count = data?.length;
  if (count === 0) return <Navigate to="onboarding" />;
  if (count === 1) {
    return (
      <>
        <Outlet />
        <Navigate to={data[0].serviceName} />
      </>
    );
  }
  return (
    <>
      <h2>{t('title')}</h2>

      <Datagrid data={data} />
    </>
  );
}

function Services() {
  const { data, isError, isLoading } = useQuery(['services'], getServices);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <Navigate to="onboarding" />;
  }

  return <ServiceList data={data} />;
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
