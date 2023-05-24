import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await, defer, useLoaderData } from 'react-router-dom';

import Breadcrumb, { BreadcrumbHandleParams } from '@/components/Breadcrumb';

import { getDedicatedNashaService } from '@/api';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export function loader(params: any) {
  const { serviceName } = params.params;
  return defer({
    services: getDedicatedNashaService({ serviceName }),
  });
}

export default function Dashboard() {
  const { t } = useTranslation('tuesday/dashboard');
  const data = useLoaderData() as Record<string, unknown>;

  return (
    <div>
      <Breadcrumb />
      <h1>{t('title')}</h1>
      <div>Dashboard page</div>
      <Suspense fallback="">
        <Await resolve={data.services}>
          {(services) => {
            const count = services.length;
            if (count === 0) {
              return <div>No services info</div>;
            }
            return (
              <div>
                <h2>Services info</h2>
                <div>{JSON.stringify(services)}</div>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
