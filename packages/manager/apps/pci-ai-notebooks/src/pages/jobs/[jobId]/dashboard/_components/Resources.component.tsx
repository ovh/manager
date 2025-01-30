import { Cpu, HardDrive, HelpCircle, MemoryStick, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { bytesConverter } from '@/lib/bytesHelper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useJobData } from '../../Job.context';

const Resources = () => {
  const { job } = useJobData();
  const { t } = useTranslation('pci-ai-training/jobs/job/dashboard');
  return (
    <div data-testid="resources-container">
      {job.spec.resources.gpu > 0 ? (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h5>{t('powerTitleSection')}</h5>
            <Zap className="size-4" />
          </div>
          <span className="uppercase">
            {`${job.spec.resources.gpu} x ${job.spec.resources.flavor}`}
          </span>
          <span>
            {`${job.spec.resources.gpu} x ${job.spec.resources.gpuModel}`}
          </span>
          <span>
            {t('gpuMemoryField', {
              gpu: job.spec.resources.gpu,
              memory: bytesConverter(job.spec.resources.gpuMemory, false, 0),
            })}
          </span>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h5>{t('powerTitleSection')}</h5>
            <Cpu className="size-4" />
          </div>
          <span className="uppercase">
            {`${job.spec.resources.cpu} x ${job.spec.resources.flavor}`}
          </span>
          <span>{`${job.spec.resources.cpu} x INTEL CPU VCORES`}</span>
        </div>
      )}
      <div className="flex flex-col mt-2">
        <div className="flex flex-row gap-2 items-center">
          <h5>{t('computeTitleSection')}</h5>
          <MemoryStick className="size-4" />
        </div>
        {job.spec.resources.gpu > 0 && (
          <span>
            {t('gcuComputeField', {
              cpu: job.spec.resources.cpu,
            })}
          </span>
        )}
        <span>
          {t('memoryField', {
            memory: bytesConverter(job.spec.resources.memory, false, 0),
          })}
        </span>
        <span>
          {t('publicNetworkField', {
            network: bytesConverter(job.spec.resources.publicNetwork, true, 2),
          })}
        </span>

        <div className="flex flex-row gap-2 items-center mt-2">
          <h5>{t('storageTitleSection')}</h5>
          <HardDrive className="size-4" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <span>
            {t('temporaryLocalStorageField', {
              storage: bytesConverter(
                job.spec.resources.ephemeralStorage,
                false,
                0,
              ),
            })}
          </span>
          <Popover>
            <PopoverTrigger>
              <HelpCircle className="size-4" />
            </PopoverTrigger>
            <PopoverContent>
              <p>{t('temporaryLocalStorageHelper')}</p>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default Resources;
