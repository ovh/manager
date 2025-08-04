import { useTranslation } from 'react-i18next';
import { OdsLink } from '@ovhcloud/ods-components/react';

interface VoucherLinkProps {
  projectId: string;
}

export default function VoucherLink({ projectId }: VoucherLinkProps) {
  const { t } = useTranslation('project');

  return (
    <div className="flex justify-start">
      <OdsLink
        href={`/public-cloud/pci/projects/${projectId}/billing/credits`}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        label={t('pci_project_project_credits_vouchers')}
        icon="arrow-right"
        aria-label={`${t(
          'pci_project_project_credits_vouchers',
        )} - Opens in new tab`}
      />
    </div>
  );
}
