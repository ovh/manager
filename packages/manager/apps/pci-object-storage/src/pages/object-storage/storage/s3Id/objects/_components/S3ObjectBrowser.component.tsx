import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud';
import { useState } from 'react';
import S3ObjectFileRenderer from './S3ObjectFileRenderer.component';
import S3ObjectDropFileModal, {
  DroppedFiles,
} from './S3ObjectDropFile.component';
import { BrowserRoot } from '@/components/browser/BrowserRoot.component';
import { BrowserFileList } from '@/components/browser/BrowserFileList.component';
import S3LZObjectFileRenderer from './S3LZObjectFileRenderer.component';
import { S3ObjectListTopbar } from './S3ObjectListTopbar.component';

interface S3ObjectBrowserProps {
  objects: StorageObject[];
  isLocaleZone?: boolean;
  showVersion: boolean;
}
const S3ObjectBrowser = ({
  objects,
  isLocaleZone,
  showVersion = false,
}: S3ObjectBrowserProps) => {
  const [dropped, setDropped] = useState<DroppedFiles>(null);
  return (
    <>
      <BrowserRoot<StorageObject>
        objects={objects}
        keyField="key"
        getObjectKey={(o) => `${o.name}-${o.versionId || 'latest'}`}
        onDropFiles={(files, path) =>
          setDropped({ files, prefix: path.replace(/\/$/, '') })
        }
      >
        <div className="flex flex-col min-h-0 border rounded-md relative max-h-[70vh]">
          <S3ObjectListTopbar />
          <BrowserFileList<StorageObject & { name: string }>
            renderFileRow={(file) =>
              isLocaleZone ? (
                <S3LZObjectFileRenderer object={file} />
              ) : (
                <S3ObjectFileRenderer object={file} showVersion={showVersion} />
              )
            }
          />
        </div>
      </BrowserRoot>

      {dropped && (
        <S3ObjectDropFileModal
          open={!!dropped}
          onClose={() => setDropped(null)}
          droppedFiles={dropped}
        />
      )}
    </>
  );
};

export default S3ObjectBrowser;
