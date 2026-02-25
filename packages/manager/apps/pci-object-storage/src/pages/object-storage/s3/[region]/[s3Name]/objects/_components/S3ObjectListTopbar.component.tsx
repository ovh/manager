import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { Checkbox } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useBrowser } from '@/components/browser/BrowserRoot.component';
import { useObjectSelection } from '../_contexts/ObjectSelection.context';

type BrowserObject = StorageObject & { name: string };

const S3ObjectListTopbar = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const { prefix, index } = useBrowser<BrowserObject>();
  const {
    selectAll,
    clearSelection,
    getSelectedObjects,
  } = useObjectSelection();

  const filesInCurrentPrefix: BrowserObject[] =
    index.filesUnder.get(prefix) || [];

  const selectedObjects = getSelectedObjects();

  const allFilesSelected =
    filesInCurrentPrefix.length > 0 &&
    filesInCurrentPrefix.every((file: BrowserObject) =>
      selectedObjects.some(
        (selected) =>
          selected.key === file.key && selected.versionId === file.versionId,
      ),
    );

  const someFilesSelected =
    !allFilesSelected &&
    filesInCurrentPrefix.some((file: BrowserObject) =>
      selectedObjects.some(
        (selected) =>
          selected.key === file.key && selected.versionId === file.versionId,
      ),
    );

  const handleSelectAll = () => {
    if (allFilesSelected) {
      clearSelection();
    } else {
      selectAll(
        filesInCurrentPrefix.map((file: BrowserObject) => ({
          key: file.key,
          versionId: file.versionId,
        })),
      );
    }
  };

  const getCheckedState = (): boolean | 'indeterminate' => {
    if (allFilesSelected) return true;
    if (someFilesSelected) return 'indeterminate';
    return false;
  };

  if (filesInCurrentPrefix.length === 0) return null;

  return (
    <div className="py-2 px-3 border-b bg-muted/50 text-sm shrink-0 flex items-center gap-3">
      <Checkbox
        checked={getCheckedState()}
        onCheckedChange={handleSelectAll}
        aria-label={t('selectAll')}
      />
      <div>
        <strong>Prefix:</strong>{' '}
        <code className="font-mono">{prefix || '/'}</code>
      </div>
    </div>
  );
};

export { S3ObjectListTopbar };
