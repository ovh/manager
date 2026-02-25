import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Button, Switch, Label, Checkbox } from '@datatr-ux/uxlib';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useS3Data } from '../S3.context';
import Guides from '@/components/guides/Guides.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { useDebounce } from '@/hooks/useDebounce.hook';
import {
  useS3ObjectsBrowser,
  S3BrowserItem,
} from '@/data/hooks/s3-storage/useS3ObjectsBrowser.hook';
import { VirtualizedBrowser } from '@/components/virtualized-browser/VirtualizedBrowser.component';
import { S3ObjectRow } from './_components/S3ObjectRow.component';
import S3ObjectDropFileModal, {
  DroppedFiles,
} from './_components/S3ObjectDropFile.component';
import RefreshButton from '@/components/refresh-button/RefreshButton.component';
import {
  ObjectSelectionProvider,
  useObjectSelection,
} from './_contexts/ObjectSelection.context';
import { BulkActionButton } from './_components/BulkActionButton.component';
import SimpleSearchBar from '@/components/simple-search-bar/SimpleSearchBar.component';
import { OBJECTS_PAGE } from './objects.constants';
import {
  buildAddObjectUrl,
  getEffectivePrefix,
  normalizePrefix,
} from './objects.utils';

interface SelectAllCheckboxProps {
  items: S3BrowserItem[];
}

const SelectAllCheckbox = ({ items }: SelectAllCheckboxProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const {
    selectAll,
    clearSelection,
    getSelectedObjects,
  } = useObjectSelection();

  const files = useMemo(
    () => items.filter((item): item is S3BrowserItem & { type: 'file' } => item.type === 'file'),
    [items],
  );

  const selectedObjects = getSelectedObjects();

  const allFilesSelected =
    files.length > 0 &&
    files.every((file) =>
      selectedObjects.some(
        (selected) =>
          selected.key === file.key && selected.versionId === file.versionId,
      ),
    );

  const someFilesSelected =
    !allFilesSelected &&
    files.some((file) =>
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
        files.map((file) => ({
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

  if (files.length === 0) return null;

  return (
    <Checkbox
      checked={getCheckedState()}
      onCheckedChange={handleSelectAll}
      aria-label={t('selectAll')}
    />
  );
};

const ListS3Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const [navigationPrefix, setNavigationPrefix] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropped, setDropped] = useState<DroppedFiles | null>(null);

  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const [withVersion, setWithVersion] = useState(false);
  const navigate = useNavigate();

  // Debounce search query to avoid flickering
  const debouncedSearchQuery = useDebounce(
    searchQuery,
    OBJECTS_PAGE.SEARCH_DEBOUNCE_MS,
  );

  // Use debounced search query as prefix when searching, otherwise use navigation prefix
  const effectivePrefix = getEffectivePrefix(
    debouncedSearchQuery,
    navigationPrefix,
  );

  const {
    items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = useS3ObjectsBrowser({
    projectId,
    region: s3?.region,
    storageName: s3?.name,
    prefix: effectivePrefix,
    withVersions: withVersion,
    limit: OBJECTS_PAGE.DEFAULT_LIMIT,
    showParent: !debouncedSearchQuery, // Don't show parent row when searching
  });

  // Clear search when navigating folders
  const handleOpenFolder = (newPrefix: string) => {
    setSearchQuery('');
    setNavigationPrefix(newPrefix);
  };

  /* ---------- RENDER ---------- */
  if (!s3 || !projectId) {
    return null;
  }

  const isDataLoading = isLoading || isFetching;
  return (
    <ObjectSelectionProvider>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
        </div>
      </div>

      <div className="flex justify-between w-full">
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(buildAddObjectUrl(effectivePrefix))}
            disabled={isDataLoading}
          >
            <Plus className="size-6" />
            {t('addNewObject')}
          </Button>
          <BulkActionButton />
        </div>
        <div className="flex items-center space-x-2">
          <SimpleSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('searchPlaceholder')}
          />
          <RefreshButton onClick={() => refetch()} isLoading={isFetching} />
          {!isLocaleZone ? (
            <>
              <Switch
                id="versions"
                checked={withVersion}
                onCheckedChange={setWithVersion}
                disabled={isDataLoading}
              />
              <Label htmlFor="versions">{t('seeVersionsSwitchLabel')}</Label>
            </>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-t-md overflow-hidden">
        <div className="py-2 px-3 border-b-0 bg-muted/50 text-sm shrink-0 flex items-center gap-3">
          <SelectAllCheckbox items={items} />
          <div>
            <strong>
              {debouncedSearchQuery ? t('searchLabel') : t('prefixLabel')}
            </strong>{' '}
            <code className="font-mono">
              {debouncedSearchQuery || navigationPrefix || t('rootPrefix')}
            </code>
          </div>
        </div>
      </div>

      <div className="border rounded-b-md border-t-0 overflow-hidden -mt-px">
        {debouncedSearchQuery && items.length === 0 && !isFetching ? (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            {t('noSearchResults', { query: debouncedSearchQuery })}
          </div>
        ) : (
          <VirtualizedBrowser
            items={items}
            hasNextPage={hasNextPage ?? false}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching}
            resetKey={`${effectivePrefix}-${withVersion}`}
            onDropFiles={(files) =>
              setDropped({ files, prefix: normalizePrefix(effectivePrefix) })
            }
            renderItem={(item) => (
              <S3ObjectRow
                item={item}
                prefix={effectivePrefix}
                onOpenFolder={handleOpenFolder}
                showVersion={withVersion}
                isLocaleZone={isLocaleZone}
              />
            )}
          />
        )}
      </div>

      {dropped && (
        <S3ObjectDropFileModal
          open={!!dropped}
          onClose={() => setDropped(null)}
          droppedFiles={dropped}
        />
      )}

      <Outlet />
    </ObjectSelectionProvider>
  );
};

export default ListS3Objects;
