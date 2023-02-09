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

import { getNashaReactAppIds } from '../api/nasha-react-app/GET/apiv6/listNasha';
import { SELECTED_NAS } from '../api/nasha-react-app/index';

export function loader() {
  return defer({
    services: getNashaReactAppIds(),
  });
}

export default function NashaReactApp() {
  const { t } = useTranslation('nasha-react-app');
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
                <hr/>
                <h1>{SELECTED_NAS}</h1>
                <h2>Informations générales</h2>
                <h2>Partitions</h2>
                <div>
                  <h3>Informations</h3>
                  <h3>Configuration</h3>
                  <h3>Abonnement</h3>
                </div>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
