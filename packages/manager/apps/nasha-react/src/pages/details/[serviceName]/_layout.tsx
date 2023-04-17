import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useParams, useResolvedPath } from 'react-router-dom';

import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@ovh-ux/manager-react-breadcrumb';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return params.serviceName;
}

export default function NashaReactDetails() {
  const { t } = useTranslation('nasha-react/details');
  const { serviceName } = useParams();

  const tabs = [
    {
      name: 'general_infos',
      title: t('tab_general'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'partitions',
      title: t('tab_partitions'),
      to: useResolvedPath('partitionsTab').pathname,
    },
  ];

  return (
    <>
      <Breadcrumb />
      <h1>{serviceName}</h1>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.name}>
            <NavLink to={tab.to}>{tab.title}</NavLink>
          </li>
        ))}
      </ul>
      <hr></hr>
      <Outlet />
    </>
  );
}
