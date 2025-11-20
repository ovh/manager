import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Label,
  Skeleton,
  Switch,
  Input,
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@datatr-ux/uxlib';
import { useState, useMemo, useDeferredValue } from 'react';
import { Plus, Search, Folder } from 'lucide-react';
import { useS3Data } from '../S3.context';
import { useGetS3Objects } from '@/data/hooks/s3-storage/useGetS3Objects.hook';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import S3ObjectBrowser from './_components/S3ObjectBrowser.component';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import FileIcon from '@/components/file-icon/FileIcon.component';

const Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const [withVersion, setWithVersion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const objectQuery = useGetS3Objects({
    projectId,
    region: s3.region,
    name: s3.name,
    withVersions: withVersion,
  });
  const navigate = useNavigate();

  const objects = objectQuery.data || [];

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredObjects = useMemo(() => {
    if (!deferredSearchQuery) return objects;
    const query = deferredSearchQuery.toLowerCase();
    return objects
      .filter((obj) => obj.key?.toLowerCase().includes(query))
      .slice(0, 50);
  }, [objects, deferredSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchOpen(true);
  };

  const handleSearchFocus = () => {
    if (deferredSearchQuery.length > 0) {
      setSearchOpen(true);
    }
  };

  if (objectQuery.isLoading) return <Objects.Skeleton />;

  return (
    <>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
          <RoadmapChangelog />
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={() => navigate('./add-object')}>
          <Plus className="size-6" />
          {t('addNewObject')}
        </Button>
        {!isLocaleZone && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="flex">
                <Input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  placeholder={t('searchPlaceholder') || 'Search...'}
                  className="max-w-full sm:max-w-72 rounded-r-none focus-visible:ring-transparent focus-visible:bg-primary-50 h-10"
                />
                <Button className="rounded-l-none h-10">
                  <Search />
                </Button>
              </div>
              {searchOpen && deferredSearchQuery.length > 0 && (
                <div className="absolute z-50 w-[400px] mt-1 p-0 bg-white border rounded-md shadow-md">
                  <Command>
                    <CommandList>
                      {filteredObjects.length === 0 && deferredSearchQuery && (
                        <CommandEmpty>No results.</CommandEmpty>
                      )}
                      {filteredObjects.length > 0 && (
                        <CommandGroup>
                          {filteredObjects.map((item) => {
                            const isFolder = item.key?.endsWith('/');
                            return (
                              <CommandItem
                                key={`${item.key}-${item.versionId ||
                                  'latest'}`}
                                value={item.key}
                                onSelect={() => {
                                  navigate(
                                    `./object?objectKey=${encodeURIComponent(
                                      item.key || '',
                                    )}`,
                                  );
                                  setSearchOpen(false);
                                }}
                                className="cursor-pointer"
                              >
                                {isFolder ? (
                                  <Folder className="mr-2 h-4 w-4" />
                                ) : (
                                  <FileIcon
                                    fileName={item.key || ''}
                                    className="mr-2 h-4 w-4 flex-shrink-0"
                                  />
                                )}
                                <div className="flex flex-col min-w-0">
                                  <span className="truncate">
                                    {String(item.key || '')
                                      .split('/')
                                      .pop()}
                                  </span>
                                  <span className="text-xs opacity-60 truncate">
                                    {item.key}
                                  </span>
                                </div>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
            <Switch
              id="versions"
              checked={withVersion}
              onCheckedChange={setWithVersion}
            />
            <Label htmlFor="versions">{t('seeVersionsSwitchLabel')}</Label>
          </div>
        )}
      </div>
      <S3ObjectBrowser
        objects={objects}
        isLocaleZone={isLocaleZone}
        showVersion={withVersion}
      />
      <Outlet />
    </>
  );
};

Objects.Skeleton = function ObjectsListSkeleton() {
  return (
    <>
      <div
        data-testid="service-list-table-skeleton"
        className="flex justify-between w-100 mb-2 items-end"
      >
        <Skeleton className="h-10 w-48" />
        <div className="flex">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-12 ml-2" />
        </div>
      </div>
      <Skeleton className="w-full h-[60vh]" />
    </>
  );
};

export default Objects;
