import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Sheet,
  SheetContent,
  Skeleton,
  useToast,
} from '@datatr-ux/uxlib';
import { useState } from 'react';
import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { Plus } from 'lucide-react';
import { useS3Data } from '../S3.context';
import { useGetS3Objects } from '@/data/hooks/s3-storage/useGetS3Objects.hook';
import DataTable from '@/components/data-table';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { octetConverter } from '@/lib/bytesHelper';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import {
  ObjectBrowser,
  ObjectBrowserToolbar,
  ObjectBrowserTreeView,
} from '@/components/object-browser';
import { ObjectBrowserContentHeader } from '@/components/object-browser/object-browser-toolbar';
import { ObjectBrowserList } from '@/components/object-browser/object-browser-list';
import FileIcon from '@/components/fileIcon/FileIcon.component';

const Objects = () => {
  const { projectId } = useParams();
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const objectQuery = useGetS3Objects({
    projectId,
    region: s3.region,
    name: s3.name,
    withVersions: true,
    // options: { refetchInterval: 15000 }
  });
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<StorageObject>();
  const [dropped, setDropped] = useState<{ files: File[]; prefix: string }>(
    null,
  );

  if (objectQuery.isLoading) return <Objects.Skeleton />;

  const objects = objectQuery.data.filter((o) => o.isLatest === true) || [];

  // Customize the File renderer to add data and context menu
  const StorageObjectFileRowRenderer = (file: StorageObject) => (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="py-2 px-3 grid grid-cols-[minmax(0,1fr)_140px_100px] items-center text-sm gap-4 hover:bg-primary-50">
          {/* NAME */}
          <div className="flex items-center gap-2 min-w-0">
            <FileIcon fileName={file.key} className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {String(file.key)
                .split('/')
                .pop()}
            </span>
          </div>

          {/* SIZE + DATE */}
          <div className="text-xs text-right text-muted-foreground">
            {file.size !== undefined && (
              <>
                {octetConverter(file.size, true, 2)}
                {' · '}
              </>
            )}
            {file.lastModified && (
              <FormattedDate
                date={new Date(file.lastModified)}
                options={{
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                }}
              />
            )}
          </div>

          {/* STORAGE CLASS */}
          <div className="text-right">
            <Badge className="text-xs" variant={'outline'}>
              {file.storageClass}
            </Badge>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ContextMenuLabel>{file.key}</ContextMenuLabel>
        <ContextMenuItem onClick={() => setSelectedFile(file)}>
          Show details
        </ContextMenuItem>
        <ContextMenuItem>Download</ContextMenuItem>
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
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

      <Button onClick={() => navigate('./add-object')}>
        <Plus className="size-6 mr-2 text-primary-foreground" />
        {t('addNewObject')}
      </Button>

      <ObjectBrowser.Root<StorageObject>
        objects={objects}
        keyField="key"
        onObjectClick={(obj) => setSelectedFile(obj)}
        onDropFiles={(files, path) => setDropped({ files, prefix: path })}
      >
        <div className="grid gap-2 grid-cols-1 md:grid-cols-[280px_1fr] h-[70vh] min-h-0 overflow-hidden">
          <div className="flex-col min-h-0 border rounded-md hidden md:flex">
            <ObjectBrowserToolbar />
            <ObjectBrowserTreeView />
          </div>

          <div className="flex flex-col min-h-0 border rounded-md relative">
            <ObjectBrowserContentHeader />
            <ObjectBrowserList<StorageObject>
              renderFileRow={StorageObjectFileRowRenderer}
            />
          </div>
        </div>
      </ObjectBrowser.Root>

      {/* Dialog to add files */}
      <Dialog open={!!dropped} onOpenChange={() => setDropped(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add files</DialogTitle>
            <DialogDescription>Add files to your s3</DialogDescription>
          </DialogHeader>
          {dropped && (
            <>
              <Input placeholder="prefix" value={dropped.prefix} />
              <ul>
                {dropped.files.map((f) => (
                  <li>{f.name}</li>
                ))}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Item details sheet */}
      <Sheet open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          {selectedFile && (
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">
                {selectedFile.key.split('/').pop()}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {selectedFile.key}
              </p>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  <span className="font-medium">{t('size')}:</span>{' '}
                  {octetConverter(selectedFile.size, true, 2)}
                </div>
                <div>
                  <span className="font-medium">{t('contentType')}:</span>{' '}
                  {selectedFile.storageClass}
                </div>
                <div>
                  <span className="font-medium">{t('lastModified')}:</span>{' '}
                  <FormattedDate
                    date={new Date(selectedFile.lastModified)}
                    options={{
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    }}
                  />
                </div>
                <Button
                  onClick={() =>
                    navigate(
                      `./object?objectKey=${encodeURIComponent(
                        selectedFile.key,
                      )}`,
                    )
                  }
                >
                  Voir les détails
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
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
      <DataTable.Skeleton columns={4} rows={10} width={100} height={16} />
    </>
  );
};

export default Objects;
