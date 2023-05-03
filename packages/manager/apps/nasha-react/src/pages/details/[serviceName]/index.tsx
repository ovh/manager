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
      <div>
        <h3>{t('partitions')}</h3>
        <Partitions serviceName={serviceName} />
        <h3>{t('informations')}</h3>
        <Informations serviceName={serviceName} />
        <h3>{t('configurations')}</h3>
        <Configurations serviceName={serviceName} />
        <h3>{t('subscriptions')}</h3>
        <Subscriptions serviceName={serviceName} />
      </div>
    </div>
  );
}
