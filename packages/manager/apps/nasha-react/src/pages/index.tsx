import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { services } from '../api/nasha-react';

const queryClient = new QueryClient();

function ServiceList({ data }) {
  const { t } = useTranslation('nasha-react');

  const count = data?.length;
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
      <ul>
        {data.map((service) => (
          <li key={service.serviceName}>
            <Link to={`/details/${service.serviceName}`}>
              {service.serviceName}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function Services() {
  const [data, setData] = useState(null);

  useEffect(() => {
    services().then((servicesData) => setData(servicesData));
  }, []);

  if (!data) {
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
