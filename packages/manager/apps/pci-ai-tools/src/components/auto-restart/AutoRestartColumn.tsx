import { RefreshCcw, OctagonX, Info } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@datatr-ux/uxlib';
import { fr } from 'date-fns/locale';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';

interface AutoRestartColumnProps {
  timeoutAutoRestart: boolean;
  timeoutAt?: string;
  translationNamespace?: string;
}

export const AutoRestartColumn = ({
  timeoutAutoRestart,
  timeoutAt,
  translationNamespace = 'ai-tools/jobs',
}: AutoRestartColumnProps) => {
  const { t } = useTranslation(translationNamespace);

  if (!timeoutAt) {
    return <span className="flex gap-2 items-center">--</span>;
  }

  const Icon = timeoutAutoRestart ? RefreshCcw : OctagonX;
  const prefix = timeoutAutoRestart ? t('restartLabel') : t('shutdownLabel');
  const dateLocale = useDateFnsLocale();
  const timeoutAtDate = format(timeoutAt, 'PPpp', { locale: dateLocale });
  const shortDate = format(timeoutAt, 'd MMM yyyy', { locale: fr });
  return (
    <div>
      <span className="flex gap-2 items-center">
        <div className="flex gap-1 items-center">
          <Icon className="size-4 inline mr-1 shrink-0" />
          {shortDate}
        </div>

        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger>
              <Info className="size-3 inline shrink-0 relative -mt-1" />
            </PopoverTrigger>
            <PopoverContent className="text-sm max-w-xs">
              {t(`${prefix}`, {
                timeout: timeoutAtDate,
              })}
            </PopoverContent>
          </Popover>
        </div>
      </span>
    </div>
  );
};
