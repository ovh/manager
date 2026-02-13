import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';
import AddS3Form from '../add/AddS3Form.component';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import { useAddS3Form } from '../add/useAddForm.hook';

export interface DroppedFiles {
  files: File[];
  prefix: string;
}
interface S3ObjectDropFileProps {
  open: boolean;
  onClose: () => void;
  droppedFiles: DroppedFiles;
}
const S3ObjectDropFileModal = ({
  onClose,
  open,
  droppedFiles,
}: S3ObjectDropFileProps) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const {
    onSubmit,
    isUploading,
    totalFilesToUploadCount,
    uploadedFilesCount,
  } = useAddS3Form({
    onUploadEnd: () => onClose?.(),
  });

  return (
    <Dialog open={open} onOpenChange={() => onClose?.()}>
      <DialogContent className="sm:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>{t('addOjectModalTitle')}</DialogTitle>
          <DialogDescription>{t('addOjectModalTitle')}</DialogDescription>
        </DialogHeader>
        <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          {isUploading ? (
            <FileUploadPending
              value={uploadedFilesCount}
              total={totalFilesToUploadCount}
            />
          ) : (
            <AddS3Form
              onSubmit={onSubmit}
              onError={() => {}}
              initialValue={{
                files: droppedFiles.files,
                prefix: droppedFiles.prefix,
                storageClass: storages.StorageClassEnum.STANDARD,
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default S3ObjectDropFileModal;
