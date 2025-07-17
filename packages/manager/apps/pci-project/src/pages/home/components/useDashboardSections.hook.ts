import { useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCreditDetails } from '@/data/hooks/useCredit';
import { formatDate } from '@/hooks/formatDate';
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
  const { t, i18n } = useTranslation('home');
  const { environment } = useContext(ShellContext);
  const {
    data: vouchersCreditDetails = [],
    isLoading,
    isError,
    error,
  } = useCreditDetails(projectId);

  const createBillingItems = useCallback(() => {
    if (isLoading) return [];

    return vouchersCreditDetails.slice(0, 3).map((credit) => ({
      label: t('voucher_credit', { voucher: credit.voucher }),
      description: credit.description,
      link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
      price: credit.balance,
      validUntil: credit.expirationDate
        ? t('expires_on', {
            date: formatDate(credit.expirationDate, 'PPpp', i18n.language),
          })
        : null,
    }));
  }, [isLoading, vouchersCreditDetails, projectId, t, i18n.language]);

  const createDocumentationItems = useCallback(() => {
    const user = environment.getUser();
    const documentationLinks = getDocumentationLinks(user.ovhSubsidiary);

    return documentationLinks.map((link) => ({
      label: t(link.labelKey),
      description: t(link.descriptionKey),
      link: link.link,
    }));
  }, [t, environment]);

  const createCommunityItems = useCallback(() => {
    return COMMUNITY_LINKS.map((link) => ({
      label: t(link.labelKey),
      description: t(link.descriptionKey),
      link: link.link,
    }));
  }, [t]);

  const sections: BottomSection[] = useMemo(
    () => [
      {
        title: t('billing_section'),
        type: 'billing' as const,
        items: createBillingItems(),
      },
      {
        title: t('documentation_section'),
        type: 'documentation' as const,
        items: createDocumentationItems(),
      },
      {
        title: t('community_section'),
        type: 'community' as const,
        items: createCommunityItems(),
      },
    ],
    [t, createBillingItems, createDocumentationItems, createCommunityItems],
  );

  return { sections, isLoading, isError, error };
}
