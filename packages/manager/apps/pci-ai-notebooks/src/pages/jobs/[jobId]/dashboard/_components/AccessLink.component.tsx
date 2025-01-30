import { Activity, ArrowUpRightFromSquare, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import A from '@/components/links/A.component';
import { useJobData } from '../../Job.context';
import * as ai from '@/types/cloud/project/ai';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const AccessLink = () => {
  const { job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/dashboard');

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
        variant="default"
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
      <Button className="w-full" type="button" variant="outline">
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
