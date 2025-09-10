import { useMemo, useCallback, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { CountryCode } from '@ovh-ux/manager-config';

import { useCreditDetails } from '@/data/hooks/useCredit';
import {
  DOCUMENTATION_LINKS_TEMPLATE,
  DOCUMENTATION_GUIDE_LINKS,
  COMMUNITY_LINKS,
  CREDIT_VOUCHER_LINK,
  DOC_BASE_URL,
} from './constants';
import { DashboardTile } from '../DashboardTile.types';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

export function useDashboardSections(projectId: string) {
  const { t } = useTranslation('project');
  const { environment } = useContext(ShellContext);
  const formatDate = useFormatDate();
  const {
    data: vouchersCreditDetails = [],
    isLoading,
    isError,
    error,
  } = useCreditDetails(projectId);

  const createBillingItems = useCallback(() => {
    const items = [];

    // Add voucher credits from API
    if (!isLoading) {
      items.push(
        ...vouchersCreditDetails.slice(0, 3).map((credit) => ({
          labelTranslationKey: t('pci_projects_project_voucher_credit', {
            voucher: credit.voucher,
          }),
          descriptionTranslationKey: credit.description,
          link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
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
      ...CREDIT_VOUCHER_LINK,
      link: CREDIT_VOUCHER_LINK.link.replace('{projectId}', projectId),
    });

    return items;
  }, [isLoading, vouchersCreditDetails, projectId, t, formatDate]);

  const createDocumentationItems = useCallback(() => {
    const user = environment.getUser();
    const subsidiary = user.ovhSubsidiary;

    return DOCUMENTATION_LINKS_TEMPLATE.map((item) => ({
      ...item,
      link:
        DOC_BASE_URL +
        (DOCUMENTATION_GUIDE_LINKS[item.guideKey][subsidiary as CountryCode] ||
          DOCUMENTATION_GUIDE_LINKS[item.guideKey].DEFAULT),
    }));
  }, [environment]);

  const tiles: DashboardTile[] = useMemo(
    () => [
      {
        titleTranslationKey: 'pci_projects_project_billing_section',
        type: 'billing' as const,
        items: createBillingItems(),
      },
      {
        titleTranslationKey: 'pci_projects_project_documentation_section',
        type: 'documentation' as const,
        items: createDocumentationItems(),
      },
      {
        titleTranslationKey: 'pci_projects_project_community_section',
        type: 'community' as const,
        items: COMMUNITY_LINKS,
      },
    ],
    [createBillingItems, createDocumentationItems],
  );

  return { tiles, isLoading, isError, error };
}
