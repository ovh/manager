import React, { useState, useEffect } from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';

function Breadcrumb() {
  const [href, setHref] = useState('');
  const shell = useShell();
  const { t } = useTranslation('catalog');

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await shell.navigation.getURL('hub', '#/', {});
        setHref(response as string);
      } catch (error) {
        setHref('#');
      }
    };
    fetchUrl();
  }, []);

  const rootItem = {
    label: 'Dashboard',
    href: String(href),
  };

  const items = [rootItem, { label: t('title'), href: '#' }];
  return <OsdsBreadcrumb items={items} />;
}

export default Breadcrumb;
