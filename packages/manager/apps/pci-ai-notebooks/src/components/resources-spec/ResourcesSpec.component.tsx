import { Cpu, HardDrive, HelpCircle, MemoryStick, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as ai from '@/types/cloud/project/ai';
import { bytesConverter } from '@/lib/bytesHelper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ResourcesProps {
  resources: ai.Resources;
}
const ResourcesSpec = ({ resources }: ResourcesProps) => {
  const { t } = useTranslation('components/resources');
  return (
    <>
      {resources.gpu > 0 ? (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h5>{t('powerTitleSection')}</h5>
            <Zap className="size-4" />
          </div>
          <span className="uppercase">
            {`${resources.gpu} x ${resources.flavor}`}
          </span>
          <span>{`${resources.gpu} x ${resources.gpuModel}`}</span>
          <span>
            {t('gpuMemoryField', {
              gpu: resources.gpu,
              memory: bytesConverter(resources.gpuMemory, false, 0),
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
            {`${resources.cpu} x ${resources.flavor}`}
          </span>
          <span>{`${resources.cpu} x INTEL CPU VCORES`}</span>
        </div>
      )}
      <div className="flex flex-col mt-2">
        <div className="flex flex-row gap-2 items-center">
          <h5>{t('computeTitleSection')}</h5>
          <MemoryStick className="size-4" />
        </div>
        {resources.gpu > 0 && (
          <span>
            {t('gcuComputeField', {
              cpu: resources.cpu,
            })}
          </span>
        )}
        <span>
          {t('memoryField', {
            memory: bytesConverter(resources.memory, false, 0),
          })}
        </span>
        <span>
          {t('publicNetworkField', {
            network: bytesConverter(resources.publicNetwork, true, 2),
          })}
        </span>

        <div className="flex flex-row gap-2 items-center mt-2">
          <h5>{t('storageTitleSection')}</h5>
          <HardDrive className="size-4" />
        </div>
        <div className="flex flex-row items-center gap-2">
          <span>
            {t('temporaryLocalStorageField', {
              storage: bytesConverter(resources.ephemeralStorage, false, 0),
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
    </>
  );
};

export default ResourcesSpec;
