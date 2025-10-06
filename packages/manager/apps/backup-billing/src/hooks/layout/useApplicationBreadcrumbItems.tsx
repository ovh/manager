import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { productName } from '@/App.constants';
import { urls } from '@/routes/Routes.constants';
import { BreadcrumbItem } from '@ovh-ux/manager-react-components';

export const useApplicationBreadcrumbItems = (): BreadcrumbItem[] => {
  const { t } = useTranslation(['listing', 'dashboard']);
  const listingHref = useHref(urls.listing);
  const dashboardHref = useHref(urls.dashboard);
  const helpHref = useHref(urls.help);

  const applicationBreadcrumbItems: BreadcrumbItem[] = [
    {
      label: productName,
      href: listingHref,
    },
    {
      label: t('dashboard:title'),
      href: dashboardHref,
    },
    {
      label: t('dashboard:help'),
      href: helpHref,
    },
  ];

  return applicationBreadcrumbItems;
};
