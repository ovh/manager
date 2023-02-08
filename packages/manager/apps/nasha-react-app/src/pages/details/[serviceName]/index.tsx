import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heading } from '@chakra-ui/react';

export default function NashaReactAppDashboard() {
  const { t } = useTranslation('nasha-react-app/details/dashboard');

  return (
    <div>
      <Heading as="h3" size="sm">
        {t('title')}
      </Heading>
    </div>
  );
}
