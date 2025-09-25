import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { urls } from '@/routes/Routes.constants';
import { BreadcrumbItem } from '@/types/Breadcrumb.type';
import { appName, productName } from '@/App.constants';

export const useApplicationBreadcrumbItems = (): BreadcrumbItem[] => {
  const { t } = useTranslation(['listing', 'dashboard']);
  const listingHref = useHref(urls.listing);
  const dashboardHref = useHref(urls.dashboard);
  const helpHref = useHref(urls.help);

  const applicationBreadcrumbItems: BreadcrumbItem[] = [
    {
      id: appName,
      label: productName,
      href: listingHref,
    },
    {
      id: 'dashboard',
      label: t('dashboard:title'),
      href: dashboardHref,
    },
    {
      id: 'help',
      label: t('dashboard:help'),
      href: helpHref,
    },
  ];

  return applicationBreadcrumbItems;
};
