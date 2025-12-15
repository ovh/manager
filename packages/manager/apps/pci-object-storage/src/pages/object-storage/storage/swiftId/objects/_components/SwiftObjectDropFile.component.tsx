import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import AddSwiftObjectForm from '../add/AddSwiftObjectForm.component';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import { useAddSwiftObjectForm } from '../add/useAddSwiftObjectForm.component';

export interface DroppedFiles {
  files: File[];
  prefix: string;
}
interface SwiftObjectDropFileProps {
  open: boolean;
  onClose: () => void;
  droppedFiles: DroppedFiles;
}
const SwiftObjectDropFileModal = ({
  onClose,
  open,
  droppedFiles,
}: SwiftObjectDropFileProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const {
    onSubmit,
    isUploading,
    totalFilesToUploadCount,
    uploadedFilesCount,
  } = useAddSwiftObjectForm({
    onUploadEnd: () => onClose?.(),
  });

  return (
    <Dialog open={open} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle data-testid="swift-object-drop-file-modal">
            {t('addOjectModalTitle')}
          </DialogTitle>
          <DialogDescription>{t('addOjectModalTitle')}</DialogDescription>
        </DialogHeader>
        <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          {isUploading ? (
            <FileUploadPending
              value={uploadedFilesCount}
              total={totalFilesToUploadCount}
            />
          ) : (
            <AddSwiftObjectForm
              onSubmit={onSubmit}
              onError={() => {}}
              initialValue={{
                files: droppedFiles.files,
                prefix: droppedFiles.prefix,
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SwiftObjectDropFileModal;
