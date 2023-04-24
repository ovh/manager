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
  service,
  serviceInfos,
  getDomains,
} from '@/api/cdn-react/Get/apiV6/service';

const queryClient = new QueryClient();

function Service(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['service', { serviceName }],
    service,
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  return (
    <>
      service {props.serviceName}
      <div>{JSON.stringify(data)}</div>
    </>
  );
}

function ServicesInfo(props: { serviceName: string }) {
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

function GetDomains(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['getDomains', { serviceName }],
    getDomains,
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
        {t('title')}
      </Heading>
      <QueryClientProvider client={queryClient}>
        <hr />
        <h2>Informations générales</h2>
        <h1>APIv6</h1>
        <h2>Service</h2>
        <Service serviceName={serviceName} />
        <div>
          <h3>ServiceInfo</h3>
          <ServicesInfo serviceName={serviceName} />
        </div>
        <div>
          <h3>Domain list</h3>
          <GetDomains serviceName={serviceName} />
        </div>
      </QueryClientProvider>
    </div>
  );
}
