import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LegalMentionsProps {
  className?: string;
}
const LegalMentions = ({ className }: LegalMentionsProps) => {
  const { t } = useTranslation('pci-databases-analytics');
  return (
    <div
      data-testid="legal-mentions-container"
      className={cn('border border-primary-100 p-4 rounded-md', className)}
    >
      <p>{t('legal-general')}</p>
    </div>
  );
};

export default LegalMentions;
