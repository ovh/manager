import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Slider,
} from '@datatr-ux/uxlib';
import { useNotebookData } from '../../Notebook.context';
import { bytesConverter } from '@/lib/bytesHelper';
import ResourcesSpec from '@/components/resources-spec/ResourcesSpec.component';

const Resources = () => {
  const { notebook } = useNotebookData();
  const { t } = useTranslation('ai-tools/notebooks/notebook/dashboard');
  return (
    <div data-testid="resources-container">
      <ResourcesSpec resources={notebook.spec.resources} allowUpdate={true} />
      <div className="flex flex-row items-center gap-2">
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
          // hideThumb={true}
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
