import { useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BreadcrumbItem } from './useBreadcrumb';
import { subRoutes, urls } from '@/routes/routes.constant';

export const useApplicationBreadcrumbItems = (): BreadcrumbItem[] => {
  const { t } = useTranslation([
    'listing',
    'installation',
    'dashboard/installation',
    NAMESPACES.FORM,
  ]);
  const listingHref = useHref(urls.listing);
  const wizardHref = useHref(urls.installationWizard);

  const { stepId } = useParams();

  const applicationBreadcrumbItems: BreadcrumbItem[] = [
    {
      id: subRoutes.listing,
      label: t('listing:sap_hub_history_list'),
      href: listingHref,
    },
    {
      id: subRoutes.report,
      label: t('dashboard/installation:dashboard_installation_description'),
    },
    {
      id: subRoutes.wizard,
      label: t('installation:common_assistant_title'),
      href: wizardHref,
    },
    {
      id: subRoutes.initialStep,
      label: t(`${NAMESPACES.FORM}:step_number`, { step: 1 }),
    },
    {
      id: stepId,
      label: t(`${NAMESPACES.FORM}:step_number`, { step: stepId }),
    },
  ];

  return applicationBreadcrumbItems;
};
