import { RefreshCcw, OctagonX } from 'lucide-react';
import { format, Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface AutoRestartColumnProps {
  timeoutAutoRestart: boolean;
  timeoutAt?: string;
  dateLocale: Locale;
  translationNamespace?: string;
}

export const AutoRestartColumn = ({
  timeoutAutoRestart,
  timeoutAt,
  dateLocale,
  translationNamespace = 'ai-tools/jobs',
}: AutoRestartColumnProps) => {
  const { t } = useTranslation(translationNamespace);

  if (!timeoutAt) {
    return <span className="flex items-center gap-2">--</span>;
  }

  const Icon = timeoutAutoRestart ? RefreshCcw : OctagonX;
  const label = timeoutAutoRestart ? t('restartLabel') : t('shutdownLabel');

  return (
    <span className="flex items-center gap-2">
      <Icon size={16} />
      <span>
        {label}
        {format(timeoutAt, 'PPpp', { locale: dateLocale })}
      </span>
    </span>
  );
};
