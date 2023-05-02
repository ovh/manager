import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, Outlet } from 'react-router-dom';

import '@ods/theme-blue-jeans/index.css';
import '@ods/stencil/components/react';
import './index.scss';

import { useQuery } from '@tanstack/react-query';
import { services } from '../api/nasha-react';
import Loading from './loading';
import NotFound from './404';

function Services() {
  const { isLoading, isError, data } = useQuery(['listNasha'], services);
  const { t } = useTranslation('nasha-react');

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <NotFound />;
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
            <Link to={`/details/${serviceName}`}>
              <osds-link color="primary">{serviceName}</osds-link>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Services;
