import React from 'react';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  OdsBreadcrumbAttributeItem,
} from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import appConfig from '../../veeam-backup.config';
import { urls } from '@/routes/routes.constant';

export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
};

export function Breadcrumb() {
  const { t } = useTranslation('veeam-backup');
  const location = useLocation();
  const navigate = useNavigate();
  const { shell } = React.useContext(ShellContext);

  const rootItems: (OdsBreadcrumbAttributeItem & { onClick?: () => void })[] = [
    {
      icon: ODS_ICON_NAME.HOME,
      onClick: () => shell.navigation.navigateTo('hub', '#/', {}),
    },
    {
      label: t('hpc-crumb'),
      onClick: () =>
        shell.navigation.navigateTo('dedicated', '#/dedicated_cloud', {}),
    },
    {
      label: t('listing-crumb'),
      onClick: () => navigate(urls.listing),
    },
  ];

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames.map((value) => ({
    label: t(value),
    href: `/#/${appConfig.rootLabel}/${value}`,
  }));

  return <OsdsBreadcrumb items={[...rootItems, ...paths]} />;
}
