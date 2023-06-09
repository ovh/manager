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
import '@ovhcloud/ods-theme-blue-jeans/index.css';

import {
  OsdsLink,
  OsdsSelectOption,
  OsdsSelect,
} from '@ovhcloud/ods-stencil/components/react/';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { getDedicatedNashaList } from '@/api';

export function loader() {
  return defer({
    services: getDedicatedNashaList(),
  });
}

export default function Listing() {
  const { t } = useTranslation('tuesday/listing');
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
      <div>
        <h2>Test tracking ods select group button</h2>
        <div>
          <OsdsSelect value="1" id="myOdsSelect">
            <OsdsSelectOption value="1">Value 1</OsdsSelectOption>
            <OsdsSelectOption value="2">Value 2</OsdsSelectOption>
            <OsdsSelectOption value="3">Value 3</OsdsSelectOption>
          </OsdsSelect>
        </div>
        <br />
        <div>
          <OsdsSelect value="1" id="myOdsSelect2">
            <OsdsSelectOption value="1">Value 1</OsdsSelectOption>
            <OsdsSelectOption value="2">Value 2</OsdsSelectOption>
            <OsdsSelectOption value="3">Value 3</OsdsSelectOption>
          </OsdsSelect>
        </div>
      </div>
      <div>
        <br />
        <br />
        <OsdsLink data-tracking="link2" color={OdsThemeColorIntent.primary}>
          <Link to={`/onboarding`}>Onboarding page</Link>
        </OsdsLink>
      </div>
    </div>
  );
}
