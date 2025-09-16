import { useMemo, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { CountryCode } from '@ovh-ux/manager-config';

import { useCreditDetails } from '@/data/hooks/useCredit';
import {
  DASHBOARD_DOCUMENTATION_LINKS_CONFIG,
  DOCUMENTATION_GUIDE_LINKS,
  DASHBOARD_COMMUNITY_LINKS,
  DASHBOARD_CREDIT_VOUCHER_LINK,
  DOC_BASE_URL,
  BASE_PROJECT_PATH,
  DashboardTile,
} from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

export function useDashboardSections(projectId: string) {
  const { t } = useTranslation('project');
  const { environment } = useContext(ShellContext);
  const subsidiary = useMemo(() => environment.getUser().ovhSubsidiary, [
    environment,
  ]);
  const formatDate = useFormatDate();
  const {
    data: vouchersCreditDetails = [],
    isLoading,
    isError,
    error,
  } = useCreditDetails(projectId);

  const createBillingItems = useMemo(() => {
    const items = [];
    const baseProjectPath = BASE_PROJECT_PATH.replace(':projectId', projectId);

    // Add voucher credits from API
    if (!isLoading) {
      items.push(
        ...vouchersCreditDetails.slice(0, 3).map((credit) => ({
          labelTranslationKey: t('pci_projects_project_voucher_credit', {
            voucher: credit.voucher,
          }),
          descriptionTranslationKey: credit.description,
          link: `${baseProjectPath}/billing/credits`,
          price: credit.balance,
          validUntil: credit.expirationDate
            ? t('pci_projects_project_expires_on', {
                date: formatDate({
                  date: credit.expirationDate,
                  format: 'PP',
                }),
              })
            : null,
        })),
      );
    }

    items.push({
      ...DASHBOARD_CREDIT_VOUCHER_LINK,
      link: baseProjectPath + DASHBOARD_CREDIT_VOUCHER_LINK.link,
    });

    return items;
  }, [isLoading, vouchersCreditDetails, projectId, t, formatDate]);

  const createDocumentationItems = useMemo(() => {
    return DASHBOARD_DOCUMENTATION_LINKS_CONFIG.map((item) => ({
      ...item,
      link: item.documentationGuideKey
        ? DOC_BASE_URL +
          (DOCUMENTATION_GUIDE_LINKS[item.documentationGuideKey][
            subsidiary as CountryCode
          ] || DOCUMENTATION_GUIDE_LINKS[item.documentationGuideKey].DEFAULT)
        : item.link,
    }));
  }, [subsidiary]);

  const tiles: DashboardTile[] = useMemo(
    () => [
      {
        titleTranslationKey: 'pci_projects_project_billing_section',
        type: 'billing' as const,
        items: createBillingItems,
      },
      {
        titleTranslationKey: 'pci_projects_project_documentation_section',
        type: 'documentation' as const,
        items: createDocumentationItems,
      },
      {
        titleTranslationKey: 'pci_projects_project_community_section',
        type: 'community' as const,
        items: DASHBOARD_COMMUNITY_LINKS,
      },
    ],
    [createBillingItems, createDocumentationItems],
  );

  return { tiles, isLoading, isError, error };
}
