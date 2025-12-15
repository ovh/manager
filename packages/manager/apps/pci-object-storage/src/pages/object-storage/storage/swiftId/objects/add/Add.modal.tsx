import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { useAddSwiftObjectForm } from './useAddSwiftObjectForm.component';
import RouteModal from '@/components/route-modal/RouteModal';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import AddSwiftObjectForm from './AddSwiftObjectForm.component';

const AddObjectModal = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  const navigate = useNavigate();

  const {
    onSubmit,
    isUploading,
    totalFilesToUploadCount,
    uploadedFilesCount,
  } = useAddSwiftObjectForm({
    onUploadEnd: () => navigate('..'),
  });

  return (
    <RouteModal>
      <DialogContent className="sm:max-w-xl" variant="information">
        <DialogHeader>
          <DialogTitle data-testid="add-object-modal">
            {t('addNewObject')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden px-1">
            {isUploading ? (
              <FileUploadPending
                value={uploadedFilesCount}
                total={totalFilesToUploadCount}
              />
            ) : (
              <AddSwiftObjectForm onSubmit={onSubmit} onError={() => {}} />
            )}
          </div>
        </DialogBody>
      </DialogContent>
    </RouteModal>
  );
};

export default AddObjectModal;
