import { useState } from 'react';
import { ContainerObject } from '@datatr-ux/ovhcloud-types/cloud/storage';
import S3ObjectDropFileModal, {
  DroppedFiles,
} from './SwiftObjectDropFile.component';
import { BrowserRoot } from '@/components/browser/BrowserRoot.component';
import { BrowserFileList } from '@/components/browser/BrowserFileList.component';
import { BrowserFileListTopbar } from '@/components/browser/BrowserFileListTopbar.component';
import SwiftObjectFileRenderer from './SwiftObjectFileRenderer.component';

interface SwiftObjectBrowserProps {
  objects: ContainerObject[];
}
const SwiftObjectBrowser = ({ objects }: SwiftObjectBrowserProps) => {
  const [dropped, setDropped] = useState<DroppedFiles>(null);
  return (
    <>
      <BrowserRoot<ContainerObject>
        objects={objects}
        keyField="name"
        onDropFiles={(files, path) =>
          setDropped({ files, prefix: path.replace(/\/$/, '') })
        }
      >
        <div
          className="flex flex-col min-h-0 border rounded-md relative max-h-[70vh]"
          data-testid="swift-object-browser"
        >
          <BrowserFileListTopbar />
          <BrowserFileList<ContainerObject & { name: string }>
            renderFileRow={(file) => <SwiftObjectFileRenderer object={file} />}
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

export default SwiftObjectBrowser;
