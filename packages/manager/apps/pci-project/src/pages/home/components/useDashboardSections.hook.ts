import { useMemo, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate, OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { useCreditDetails } from '@/data/hooks/useCredit';
import {
  DASHBOARD_CREDIT_VOUCHER_LINK,
  BASE_PROJECT_PATH,
  DashboardTile,
  DashboardItem,
  DASHBOARD_DOCUMENTATION_LINKS_CONFIG,
  DASHBOARD_COMMUNITY_LINKS_CONFIG,
  QUOTA_LIMIT_GUIDES,
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

    // Add quota guides link
    const quotaGuidesLink =
      QUOTA_LIMIT_GUIDES[subsidiary as OvhSubsidiary] ||
      QUOTA_LIMIT_GUIDES.DEFAULT;
    items.push({
      linkLabelTranslationKey: 'pci_projects_home_quota_guides',
      link: quotaGuidesLink,
      color: 'primary',
    });

    // Add credit voucher link
    items.push({
      ...DASHBOARD_CREDIT_VOUCHER_LINK,
      link: baseProjectPath + DASHBOARD_CREDIT_VOUCHER_LINK.link,
    });

    return items;
  }, [isLoading, vouchersCreditDetails, projectId, t, formatDate, subsidiary]);

  const region = environment.getRegion();
  const communityItems = DASHBOARD_COMMUNITY_LINKS_CONFIG.filter(
    (link) => !link.regions || link.regions.includes(region),
  );

  const tiles: DashboardTile[] = useMemo(
    () => [
      {
        titleTranslationKey: 'pci_projects_home_billing_section',
        type: 'billing' as const,
        items: billingItems,
      },
      {
        titleTranslationKey: 'pci_projects_home_documentation_section',
        items: DASHBOARD_DOCUMENTATION_LINKS_CONFIG,
      },
      {
        titleTranslationKey: 'pci_projects_home_community_section',
        items: communityItems,
      },
    ],
    [billingItems, communityItems],
  );

  return { tiles, isLoading, isError, error };
}
