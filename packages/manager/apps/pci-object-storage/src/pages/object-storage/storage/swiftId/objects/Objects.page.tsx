import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Sheet, SheetContent, Skeleton, useToast } from '@datatr-ux/uxlib';
import { ContainerObject } from '@datatr-ux/ovhcloud-types/cloud/storage/index';
import { useSwiftData } from '../Swift.context';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { octetConverter } from '@/lib/bytesHelper';
import { ObjectBrowser } from '@/components/object-browser';

const SwiftObjectsPage = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  const { swift, swiftQuery } = useSwiftData();
  const [selectedFile, setSelectedFile] = useState<ContainerObject | null>(
    null,
  );

  const toast = useToast();

  if (swiftQuery.isLoading) return <Skeleton className="h-96 w-full" />;
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
          <RoadmapChangelog />
        </div>
      </div>

      <ObjectBrowser.Root<ContainerObject>
        objects={swift.objects || []}
        onObjectClick={(obj) => setSelectedFile(obj)}
        onDropFiles={(files, path) => console.log(files, path)}
      />

      <Sheet open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <SheetContent side="right" className="w-[400px] overflow-y-auto">
          {selectedFile && (
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">
                {selectedFile.name.split('/').pop()}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {selectedFile.name}
              </p>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  <span className="font-medium">{t('size')}:</span>{' '}
                  {octetConverter(selectedFile.size, true, 2)}
                </div>
                <div>
                  <span className="font-medium">{t('contentType')}:</span>{' '}
                  {selectedFile.contentType}
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
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Outlet />
    </>
  );
};

export default SwiftObjectsPage;
