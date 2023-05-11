import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { services } from '../api/nasha-react';
import Datagrid from '@/components/layout-helpers/list/dataGrid';

const queryClient = new QueryClient();

function ServiceList({ data }) {
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
  const [data, setData] = useState(null);

  useEffect(() => {
    services()
      .then((servicesData) => setData(servicesData))
      .catch(() => {
        return <Navigate to="onboarding" />;
      });
  }, []);

  if (data) return <ServiceList data={data} />;
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
