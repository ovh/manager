import { useMemo, useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useCreditDetails } from '@/data/hooks/useCredit';
import {
  getDocumentationLinks,
  COMMUNITY_LINKS,
  BILLING_LINKS,
} from './constants';

// Types for dashboard sections
export type BottomSection = {
  title: string;
  type: 'billing' | 'documentation' | 'community';
  items: BottomSectionItem[];
};

export type BottomSectionItem = {
  label: string;
  description?: string;
  link: string | string[];
  price?: string;
  validUntil?: string | null;
  icon?: string;
  target?: string;
  rel?: string;
  color?: string;
  ariaLabelKey?: string;
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
    const items = [];

    // Add voucher credits from API
    if (!isLoading) {
      items.push(
        ...vouchersCreditDetails.slice(0, 3).map((credit) => ({
          label: t('pci_project_project_voucher_credit', {
            voucher: credit.voucher,
          }),
          description: credit.description,
          link: `/public-cloud/pci/projects/${projectId}/billing/credits`,
          price: credit.balance,
          validUntil: credit.expirationDate
            ? t('pci_project_project_expires_on', {
                date: formatDate({
                  date: credit.expirationDate,
                  format: 'PPpp',
                }),
              })
            : null,
        })),
      );
    }

    // Add billing links (including voucher link) - these are static constants
    items.push(
      ...BILLING_LINKS.map((link) => ({
        label: '',
        description: `pci_project_project_${link.descriptionKey}`,
        link: link.link.replace('{projectId}', projectId),
        icon: link.icon,
        target: link.target,
        rel: link.rel,
        color: link.color,
        ariaLabelKey: link.ariaLabelKey,
      })),
    );

    return items;
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
    return COMMUNITY_LINKS.flatMap((link) => {
      if ('items' in link && link.items) {
        // Handle items structure - create title item and sub-items
        const titleItem = {
          label: t(`pci_project_project_${link.labelKey}`),
          description: '',
          link: '',
        };

        const subItems = link.items.map((item) => ({
          label: '',
          description: t(`pci_project_project_${item.descriptionKey}`),
          link: item.link,
        }));

        return [titleItem, ...subItems];
      }
      // Handle single link structure
      return [
        {
          label: t(`pci_project_project_${link.labelKey}`),
          description: t(`pci_project_project_${link.descriptionKey}`),
          link: link.link,
        },
      ];
    });
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
