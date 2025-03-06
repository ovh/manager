import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

function Breadcrumb() {
  const { shell } = React.useContext(ShellContext);
  const { t } = useTranslation('catalog');
  const [href, setHref] = React.useState('');
  const location = useLocation();

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

  const items = [rootItem, { label: t('title'), href: '#' }];
  if (location.pathname !== '/') {
    items.push({
      label: t(
        `title_${location.pathname.replace(/^\//, '').replace(/\//g, '_')}`,
      ),
      href: location.pathname,
    });
  }

  return (
    <>
      Running ODS18
      <OdsBreadcrumb>
        <OdsBreadcrumbItem href="/" label="Home">
          Home
        </OdsBreadcrumbItem>
        <OdsBreadcrumbItem href="/nasha" label="NAS-HA">
          NAS-HA
        </OdsBreadcrumbItem>
      </OdsBreadcrumb>
    </>
  );
}

export default Breadcrumb;
