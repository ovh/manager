import { Cpu, HardDrive, HelpCircle, MemoryStick, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotebookData } from '../../Notebook.context';
import { bytesConverter } from '@/lib/bytesHelper';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const Resources = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('pci-ai-notebooks/notebooks/notebook/dashboard');
  return (
    <div data-testid="resources-container">
      {notebook.spec.resources.gpu > 0 ? (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <h5>Power</h5>
            <Zap className="size-4" />
          </div>
          <span className="uppercase">
            {`${notebook.spec.resources.gpu} x ${notebook.spec.resources.flavor}`}
          </span>
          <span>
            {`${notebook.spec.resources.gpu} x ${notebook.spec.resources.gpuModel}`}
          </span>
          <span>
            {t('gpuMemoryField', {
              gpu: notebook.spec.resources.gpu,
              memory: bytesConverter(
                notebook.spec.resources.gpuMemory,
                false,
                0,
              ),
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
            {`${notebook.spec.resources.cpu} x ${notebook.spec.resources.flavor}`}
          </span>
          <span>{`${notebook.spec.resources.cpu} x INTEL CPU VCORES`}</span>
        </div>
      )}
      <div className="flex flex-col mt-2">
        <div className="flex flex-row gap-2 items-center">
          <h5>{t('computeTitleSection')}</h5>
          <MemoryStick className="size-4" />
        </div>
        {notebook.spec.resources.gpu > 0 && (
          <span>
            {t('gcuComputeField', {
              cpu: notebook.spec.resources.cpu,
            })}
          </span>
        )}
        <span>
          {t('memoryField', {
            memory: bytesConverter(notebook.spec.resources.memory, false, 0),
          })}
        </span>
        <span>
          {t('publicNetworkField', {
            network: bytesConverter(
              notebook.spec.resources.publicNetwork,
              true,
              2,
            ),
          })}
        </span>

        <div className="flex flex-row gap-2 items-center mt-2">
          <h5>{t('storageTitleSection')}</h5>
          <HardDrive className="size-4" />
        </div>
        <div className="flex flex-row items-center justify-between">
          <span>
            {t('temporaryLocalStorageField', {
              storage: bytesConverter(
                notebook.spec.resources.ephemeralStorage,
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
      <div className="flex flex-row items-center justify-between">
        <span>
          {t('workspaceStorage', {
            storage: bytesConverter(
              notebook.status.workspace.storageFree,
              false,
              1,
            ),
          })}
        </span>
        <Popover>
          <PopoverTrigger>
            <HelpCircle className="size-4" />
          </PopoverTrigger>
          <PopoverContent>
            <p>{t('workspaceStorageHelper')}</p>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-1 mt-3 mr-4">
        <Slider
          data-testid="storage-slider"
          id="storage-slider"
          name="storage-slider"
          defaultValue={[0]}
          value={[notebook.status.workspace.storageUsed]}
          min={0}
          max={notebook.status.workspace.storageFree}
        />
        <span className="text-sm">
          {t('sliderInfo', {
            usedStorage: bytesConverter(
              notebook.status.workspace.storageUsed,
              false,
              1,
            ),
            totalStorage: bytesConverter(
              notebook.status.workspace.storageFree,
              false,
              1,
            ),
          })}
        </span>
      </div>
    </div>
  );
};

export default Resources;
