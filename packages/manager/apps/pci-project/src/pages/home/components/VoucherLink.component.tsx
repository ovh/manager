import { useTranslation } from 'react-i18next';

interface VoucherLinkProps {
  projectId: string;
}

export default function VoucherLink({ projectId }: VoucherLinkProps) {
  const { t } = useTranslation('home');

  return (
    <div className="flex justify-start">
      <a
        href={`/public-cloud/pci/projects/${projectId}/billing/credits`}
        className="text-[var(--ods-color-primary-500)] font-semibold text-sm no-underline hover:underline"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('credits_vouchers')} - Opens in new tab`}
      >
        {t('credits_vouchers')} →
      </a>
    </div>
  );
}
