import { useTranslation } from 'react-i18next';
import { P } from '@/components/typography';
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
      <P>{t('legal-general')}</P>
      {showRedisMessage && <P>{t('legal-redis')}</P>}
    </div>
  );
};

export default LegalMentions;
