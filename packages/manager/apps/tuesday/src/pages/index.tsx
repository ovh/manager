import React, { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Await,
  defer,
  Link,
  Navigate,
  Outlet,
  useLoaderData,
} from 'react-router-dom';

import { getDedicatedNashaList } from '@/api';

export function loader() {
  return defer({
    services: getDedicatedNashaList(),
  });
}

export default function Listing() {
  const { t } = useTranslation('tuesday/listing');
  const data = useLoaderData() as Record<string, unknown>;

  useEffect(() => {
    console.info('++++++++++++++++++++++++++');
    console.info('USEEFFECT LISTING INIT !');
  }, []);

  return (
    <div>
      <h1>{t('title')}</h1>
      <Suspense fallback="">
        <Await resolve={data.services}>
          {(services) => {
            const count = services.length;
            if (count === 0) {
              return <Navigate to="onboarding" />;
            }
            if (count === 1) {
              return (
                <>
                  <Outlet />
                  <Navigate to={services[0]} />
                </>
              );
            }
            return (
              <>
                <h2>Services list</h2>
                <ul>
                  {services.map((serviceName: string) => (
                    <li key={serviceName}>
                      <Link to={`/dashboard/${serviceName}`}>
                        {serviceName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
