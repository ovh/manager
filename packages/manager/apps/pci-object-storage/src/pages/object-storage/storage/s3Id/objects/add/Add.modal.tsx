import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import RouteModal from '@/components/route-modal/RouteModal';
import AddS3Form from './AddS3Form.component';
import { useAddS3Form } from './useAddForm.component';
import storages from '@/types/Storages';

const AddObjectModal = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefixFromUrl = searchParams.get('prefix') || '';

  const {
    onSubmit,
    isUploading,
    totalFilesToUploadCount,
    uploadedFilesCount,
  } = useAddS3Form({
    onUploadEnd: () => navigate('..'),
  });

  return (
    <RouteModal>
      <DialogContent className="sm:max-w-xl" variant="information">
        <DialogHeader>
          <DialogTitle>{t('addNewObject')}</DialogTitle>
        </DialogHeader>
        <DialogBody className="px-1">
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
                  prefix: prefixFromUrl,
                  storageClass: storages.StorageClassEnum.STANDARD,
                }}
              />
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </RouteModal>
  );
};

export default AddObjectModal;
