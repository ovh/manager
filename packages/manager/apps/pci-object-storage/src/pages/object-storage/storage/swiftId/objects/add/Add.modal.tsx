import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogHeader, DialogTitle } from '@datatr-ux/uxlib';
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
      <DialogContent className="sm:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          {isUploading ? (
            <FileUploadPending
              value={uploadedFilesCount}
              total={totalFilesToUploadCount}
            />
          ) : (
            <AddSwiftObjectForm onSubmit={onSubmit} onError={() => {}} />
          )}
        </div>
      </DialogContent>
    </RouteModal>
  );
};

export default AddObjectModal;
