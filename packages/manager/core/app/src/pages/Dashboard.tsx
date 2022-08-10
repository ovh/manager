import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getNutanix } from '@/api/nutanix';
import Dashboard, { tileTypesEnum } from '../components/Dashboard';

export default function DashboardPage(): JSX.Element {
  const { t } = useTranslation('dashboard');
  const { serviceId } = useParams();

  const tiles = [
    {
      name: 'general',
      heading: t('tile_general_title'),
      type: tileTypesEnum.LIST,
      onLoad: () => getNutanix(serviceId),
      listItems: [{}],
    },
    {
      name: 'licenses',
      heading: t('tile_licenses_title'),
    },
    {
      name: 'billing',
      heading: t('tile_billing_title'),
    },
    {
      name: 'support',
      heading: t('tile_supportl_title'),
    },
    {
      name: 'network',
      heading: t('tile_network_title'),
    },
    {
      name: 'hardware',
      heading: t('tile_hardware_title'),
    },
  ];

  return <Dashboard tiles={tiles} />;
}
