import { useNavigate } from 'react-router-dom';
import { DialogContent, DialogHeader, DialogTitle } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import RouteModal from '@/components/route-modal/RouteModal';
import RestoreS3Form from './RestoreS3Form.component';
import { useRestoreS3Form } from './useRestoreForm.component';

const RestoreObjectModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  const { onSubmit, currentExpireDate } = useRestoreS3Form({
    onRestoreEnd: () => navigate('..'),
  });

  return (
    <RouteModal>
      <DialogContent className="sm:max-w-xl px-0">
        <DialogHeader className="px-6">
          <DialogTitle>{t('restoreModalTitle')}</DialogTitle>
        </DialogHeader>
        <div className="w-full max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <RestoreS3Form
            key={currentExpireDate || 'new'}
            onSubmit={onSubmit}
            onError={() => {}}
            currentExpireDate={currentExpireDate}
          />
        </div>
      </DialogContent>
    </RouteModal>
  );
};

export default RestoreObjectModal;
