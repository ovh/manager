import { useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useCreditDetails } from '@/data/hooks/useCredit';
import { getDocumentationLinks, COMMUNITY_LINKS } from './constants';

// Types for dashboard sections
export type BottomSection = {
  title: string;
  type: 'billing' | 'documentation' | 'community';
  items: BottomSectionItem[];
};

export type BottomSectionItem = {
  label: string;
  description?: string;
  link: string;
  price?: string;
  validUntil?: string | null;
  isVoucherLink?: boolean;
};

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
    if (isLoading) return [];

    return vouchersCreditDetails.slice(0, 3).map((credit) => ({
      label: t('pci_project_project_voucher_credit', {
        voucher: credit.voucher,
      }),
      description: credit.description,
      link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
      price: credit.balance,
      validUntil: credit.expirationDate
        ? t('pci_project_project_expires_on', {
            date: formatDate({ date: credit.expirationDate, format: 'PPpp' }),
          })
        : null,
    }));
  }, [isLoading, vouchersCreditDetails, projectId, t, formatDate]);

  const createDocumentationItems = useCallback(() => {
    const user = environment.getUser();
    const documentationLinks = getDocumentationLinks(user.ovhSubsidiary);

    return documentationLinks.map((link) => ({
      label: t(`pci_project_project_${link.labelKey}`),
      description: t(`pci_project_project_${link.descriptionKey}`),
      link: link.link,
    }));
  }, [t, environment]);

  const createCommunityItems = useCallback(() => {
    return COMMUNITY_LINKS.map((link) => ({
      label: t(`pci_project_project_${link.labelKey}`),
      description: t(`pci_project_project_${link.descriptionKey}`),
      link: link.link,
    }));
  }, [t]);

  const sections: BottomSection[] = useMemo(
    () => [
      {
        title: t('pci_project_project_billing_section'),
        type: 'billing' as const,
        items: createBillingItems(),
      },
      {
        title: t('pci_project_project_documentation_section'),
        type: 'documentation' as const,
        items: createDocumentationItems(),
      },
      {
        title: t('pci_project_project_community_section'),
        type: 'community' as const,
        items: createCommunityItems(),
      },
    ],
    [t, createBillingItems, createDocumentationItems, createCommunityItems],
  );

  return { sections, isLoading, isError, error };
}
