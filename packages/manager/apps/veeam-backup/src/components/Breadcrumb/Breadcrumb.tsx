import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsIconName } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  getVeeamBackupDisplayName,
  useVeeamBackup,
} from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import { appName, productName } from '@/veeam-backup.config';

export type BreadcrumbItem = {
  label: string | undefined;
  href: string;
  icon?: OdsIconName;
};

type BreadcrumbNavigationItem = BreadcrumbItem & {
  onClick?: () => void;
};

export function Breadcrumb() {
  const { t } = useTranslation('veeam-backup');
  const location = useLocation();
  const navigate = useNavigate();
  const { shell } = React.useContext(ShellContext);
  const { id } = useParams();
  const { data } = useVeeamBackup(id);

  const rootItems: BreadcrumbNavigationItem[] = [
    {
      label: undefined,
      icon: 'home',
      href: undefined,
      onClick: () => shell.navigation.navigateTo('hub', '#/', {}),
    },
    {
      label: t('hpc-crumb'),
      href: undefined,
      onClick: () =>
        shell.navigation.navigateTo('dedicated', '#/dedicated_cloud', {}),
    },
    {
      label: productName,
      href: undefined,
      onClick: () => navigate(urls.listing),
    },
  ];

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames.map((value) => ({
    label: getVeeamBackupDisplayName(data?.data) ?? t(value),
    href: `/#/${appName}/${value}`,
  }));

  const items: BreadcrumbNavigationItem[] = [...rootItems, ...paths];

  const breadcrumbItems = React.useMemo(
    () => items.map((item) => ({ ...item, id: crypto.randomUUID() })),
    [items],
  );

  return (
    <OdsBreadcrumb>
      {breadcrumbItems.map((item) => (
        <OdsBreadcrumbItem key={item.id} {...item} />
      ))}
    </OdsBreadcrumb>
  );
}
