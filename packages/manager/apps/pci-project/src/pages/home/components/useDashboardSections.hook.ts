import { useMemo, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate, OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { useCreditDetails } from '@/data/hooks/useCredit';
import {
  DASHBOARD_DOCUMENTATION_LINKS_CONFIG,
  DASHBOARD_COMMUNITY_LINKS,
  DASHBOARD_CREDIT_VOUCHER_LINK,
  getDocumentationGuideLink,
  BASE_PROJECT_PATH,
  DashboardTile,
  DashboardItem,
} from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

export function useDashboardSections(projectId: string) {
  const { t } = useTranslation('home');
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

  const billingItems = useMemo((): DashboardItem[] => {
    let items: DashboardItem[] = [];
    const baseProjectPath = BASE_PROJECT_PATH.replace(':projectId', projectId);

    // Add voucher credits from API
    if (!isLoading) {
      items = vouchersCreditDetails.slice(0, 3).map((credit) => ({
        label: t('pci_projects_home_voucher_credit', {
          voucher: credit.voucher,
        }),
        description: credit.description,
        price: credit.balance,
        validUntil: credit.expirationDate
          ? t('pci_projects_home_expires_on', {
              date: formatDate({
                date: credit.expirationDate,
                format: 'PPPp',
              }),
            })
          : null,
      }));
    }

    items.push({
      ...DASHBOARD_CREDIT_VOUCHER_LINK,
      link: baseProjectPath + DASHBOARD_CREDIT_VOUCHER_LINK.link,
    });

    return items;
  }, [isLoading, vouchersCreditDetails, projectId, t, formatDate]);

  const documentationItems = useMemo((): DashboardItem[] => {
    return DASHBOARD_DOCUMENTATION_LINKS_CONFIG.map((item) => ({
      ...item,
      link: item.documentationGuideKey
        ? getDocumentationGuideLink(
            item.documentationGuideKey,
            subsidiary as OvhSubsidiary,
          )
        : item.link,
    }));
  }, [subsidiary]);

  const tiles: DashboardTile[] = useMemo(
    () => [
      {
        titleTranslationKey: 'pci_projects_home_billing_section',
        type: 'billing' as const,
        items: billingItems,
      },
      {
        titleTranslationKey: 'pci_projects_home_documentation_section',
        items: documentationItems,
      },
      {
        titleTranslationKey: 'pci_projects_home_community_section',
        items: DASHBOARD_COMMUNITY_LINKS,
      },
    ],
    [billingItems, documentationItems],
  );

  return { tiles, isLoading, isError, error };
}
