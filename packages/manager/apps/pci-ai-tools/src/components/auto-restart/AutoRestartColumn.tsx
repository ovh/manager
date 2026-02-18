import { RefreshCcw, OctagonX, Info, CircleAlert } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@datatr-ux/uxlib';
import { fr } from 'date-fns/locale';
import { useDateFnsLocale } from '@/hooks/useDateFnsLocale.hook';

interface AutoRestartColumnProps {
  timeoutAutoRestart: boolean;
  timeoutAt?: string;
  statusCode?: string;
  statusState?: string;
  translationNamespace?: string;
}

export const AutoRestartColumn = ({
  timeoutAutoRestart,
  timeoutAt,
  statusCode,
  statusState,
  translationNamespace = 'ai-tools/jobs',
}: AutoRestartColumnProps) => {
  const { t } = useTranslation(translationNamespace);
  const isPendingCode = ['JOB_PENDING', 'NOTEBOOK_PENDING'].includes(
    statusCode ?? '',
  );
  const isPendingState = ['PENDING', 'QUEUED', 'STARTING'].includes(
    statusState ?? '',
  );
  const isJobPending = isPendingCode || isPendingState;

  if (isJobPending) {
    return (
      <div>
        <span className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger>
              <CircleAlert
                className="size-4 shrink-0 cursor-pointer"
                data-testid="pending-timeout-info-trigger"
              />
            </PopoverTrigger>
            <PopoverContent className="text-sm max-w-xs">
              <p>{t('pendingTimeoutHint')}</p>
            </PopoverContent>
          </Popover>
          <span>{t('waitingResourceLabel')}</span>
        </span>
      </div>
    );
  }

  if (!timeoutAt) {
    return <span className="flex gap-2 items-center">--</span>;
  }

  const Icon = timeoutAutoRestart ? RefreshCcw : OctagonX;
  const labelKey = timeoutAutoRestart ? 'restartLabel' : 'shutdownLabel';
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
              {t(labelKey, {
                timeout: timeoutAtDate,
              })}
            </PopoverContent>
          </Popover>
        </div>
      </span>
    </div>
  );
};
