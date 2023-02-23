import { Heading } from '@chakra-ui/react';
import i18next from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function breadcrumb() {
  return i18next.t('cdn-react/details/tab:crumb');
}

export default function CdnReactTab() {
  const { t } = useTranslation('cdn-react/details/tab');

  return (
    <>
      <Heading as="h3" size="sm">
        {t('title')}
      </Heading>
      Rename me by:
      <ul>
        <li>changing my file name by the route path you want</li>
        <li>changing the translation path loaded at line 5</li>
        <li>changing the tab title in _layout.tsx file</li>
      </ul>
    </>
  );
}
