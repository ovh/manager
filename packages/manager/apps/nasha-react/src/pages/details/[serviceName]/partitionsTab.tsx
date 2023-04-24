import { Heading } from '@chakra-ui/react';
import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('nasha-react/details/partitions:crumb');
}

export default function NashaReactPartitionsTab() {
  const { t } = useTranslation('nasha-react/details/partitions');

  return (
    <>
      <Heading as="h3" size="sm">
        {t('title')}
      </Heading>
    </>
  );
}
