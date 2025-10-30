import { useNavigate } from 'react-router-dom';
import { DialogContent, DialogHeader, DialogTitle } from '@datatr-ux/uxlib';
import FileUploadPending from '@/components/file-input/FileUploadPending.component';
import RouteModal from '@/components/route-modal/RouteModal';
import AddS3Form from './AddS3Form.component';
import { useAddS3Form } from './useAddForm.component';

const AddObjectModal = () => {
  const navigate = useNavigate();

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
      <DialogContent className="sm:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>TODO</DialogTitle>
        </DialogHeader>
        <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          {isUploading ? (
            <FileUploadPending
              value={uploadedFilesCount}
              total={totalFilesToUploadCount}
            />
          ) : (
            <AddS3Form onSubmit={onSubmit} onError={() => {}} />
          )}
        </div>
      </DialogContent>
    </RouteModal>
  );
};

export default AddObjectModal;
