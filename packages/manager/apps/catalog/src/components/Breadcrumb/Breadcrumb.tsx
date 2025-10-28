import React from 'react';

import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function Breadcrumb() {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation(NAMESPACES.NAVIGATION);
  const [href, setHref] = React.useState('');

  React.useEffect(() => {
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

  const items = [
    rootItem,
    { label: t('manager_navigation_catalog'), href: '#' },
  ];
  return <OsdsBreadcrumb items={items} />;
}

export default Breadcrumb;
