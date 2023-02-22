import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import Partitions from './partitions';
import Subscriptions from './suscriptions';
import Informations from './informations';
import Configurations from './configurations';

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div>
      <Heading as="h3" size="sm">
        {t('title')}
      </Heading>
      <hr />
      <h2>Informations générales</h2>
      <div>
        <h3>Partitions</h3>
        <Partitions serviceName={serviceName} />
        <h3>Informations</h3>
        <Informations serviceName={serviceName} />
        <h3>Configuration</h3>
        <Configurations serviceName={serviceName} />
        <h3>Abonnement</h3>
        <Subscriptions serviceName={serviceName} />
      </div>
    </div>
  );
}
