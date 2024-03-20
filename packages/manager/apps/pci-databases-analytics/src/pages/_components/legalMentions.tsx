import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface LegalMentionsProps {
  showRedisMessage: boolean;
  className?: string;
}
const LegalMentions = ({
  showRedisMessage = false,
  className,
}: LegalMentionsProps) => {
  const { t } = useTranslation('pci-databases-analytics');
  return (
    <div className={cn('border border-primary-100 p-4 rounded-md', className)}>
      <p>{t('legal-general')}</p>
      {showRedisMessage && <p>{t('legal-redis')}</p>}
    </div>
  );
};

export default LegalMentions;
