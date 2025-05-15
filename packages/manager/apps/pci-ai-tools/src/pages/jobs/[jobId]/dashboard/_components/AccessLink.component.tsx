import { Activity, ArrowUpRightFromSquare, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@datatr-ux/uxlib';
import A from '@/components/links/A.component';
import { useJobData } from '../../Job.context';
import ai from '@/types/AI';

const AccessLink = () => {
  const { job } = useJobData();
  const { t } = useTranslation('ai-tools/jobs/job/dashboard');

  return (
    <>
      <div className="flex flex-row gap-2 items-center mb-2">
        <h5>{t('accessTitle')}</h5>
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="size-4" />
          </PopoverTrigger>
          <PopoverContent>
            <p>{t('accessTooltip')}</p>
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={job.status.state !== ai.job.JobStateEnum.RUNNING}
      >
        <A href={job.status.url} target="_blank" rel="noopener noreferrer">
          <div className="flex flex-row gap-1 items-center text-white">
            {t('httpAccess')}
            <ArrowUpRightFromSquare className="size-4" />
          </div>
        </A>
      </Button>
      <div className="flex flex-row gap-2 items-center mt-4 mb-2">
        <h5>{t('grafanaTitle')}</h5>
        <Activity className="size-4" />
      </div>
      <Button
        className="w-full"
        type="button"
        mode="outline"
        disabled={!job.status.monitoringUrl}
      >
        <A
          href={job.status.monitoringUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex flex-row gap-1 items-center ">
            {t('grafanaButton')}
            <ArrowUpRightFromSquare className="size-4" />
          </div>
        </A>
      </Button>
    </>
  );
};

export default AccessLink;
