import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Await,
  defer,
  Link,
  Navigate,
  Outlet,
  useLoaderData,
} from 'react-router-dom';

import { getCdnReactIds } from '../api/cdn-react/Get/apiV6/service';

export function loader() {
  return defer({
    services: getCdnReactIds(),
  });
}

export default function CdnReact() {
  const { t } = useTranslation('cdn-react');
  const data = useLoaderData() as Record<string, unknown>;

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
                      <Link to={`/details/${serviceName}`}>{serviceName}</Link>
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
