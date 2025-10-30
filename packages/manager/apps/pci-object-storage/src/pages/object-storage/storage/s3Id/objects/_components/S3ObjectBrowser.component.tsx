import { StorageObject } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useState } from 'react';
import S3ObjectFileRenderer from './S3ObjectFileRenderer.component';
import S3ObjectDropFileModal, {
  DroppedFiles,
} from './S3ObjectDropFile.component';
import { BrowserRoot } from '@/components/browser/BrowserRoot.component';
import { BrowserFileList } from '@/components/browser/BrowserFileList.component';
import { BrowserFileListTopbar } from '@/components/browser/BrowserFileListTopbar.component';

interface S3ObjectBrowserProps {
  objects: StorageObject[];
}
const S3ObjectBrowser = ({ objects }: S3ObjectBrowserProps) => {
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
          <BrowserFileListTopbar />
          <BrowserFileList<StorageObject & { name: string }>
            renderFileRow={(file) => <S3ObjectFileRenderer object={file} />}
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
