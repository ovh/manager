import { useNavigate } from 'react-router-dom';
import {
  Alert,
  AlertDescription,
  Button,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import RouteModal from '@/components/route-modal/RouteModal';
import RestoreS3Form from './RestoreS3Form.component';
import { useRestoreS3Form } from './useRestoreForm.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';

const RestoreObjectModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');

  const { onSubmit, isPending, currentExpireDate } = useRestoreS3Form({
    onRestoreEnd: () => navigate(-1),
  });

  return (
    <RouteModal backUrl={-1}>
      <DialogContent variant="information">
        <DialogHeader>
          <DialogTitle>{t('restoreModalTitle')}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {currentExpireDate && (
            <Alert variant="information" className="mb-2">
              <AlertDescription>
                {t('restoreCurrentExpireInfo')}{' '}
                <FormattedDate
                  date={new Date(currentExpireDate)}
                  options={{
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }}
                />
              </AlertDescription>
            </Alert>
          )}
          <RestoreS3Form
            formId="restore-s3-form"
            key={currentExpireDate || 'new'}
            onSubmit={onSubmit}
            onError={() => {}}
            currentExpireDate={currentExpireDate}
          />
        </DialogBody>
        <DialogFooter className="flex justify-end">
          <DialogClose asChild>
            <Button type="button" mode="ghost">
              {t('restoreButtonCancel')}
            </Button>
          </DialogClose>
          <Button type="submit" form="restore-s3-form" disabled={isPending}>
            {t('restoreButtonConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default RestoreObjectModal;
