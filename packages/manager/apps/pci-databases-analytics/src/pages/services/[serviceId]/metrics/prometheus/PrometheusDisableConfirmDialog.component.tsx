import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@datatr-ux/uxlib';

interface PrometheusDisableConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}
const PrometheusDisableConfirmDialog = ({
  onCancel,
  onConfirm,
}: PrometheusDisableConfirmDialogProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/metrics/prometheus',
  );
  return (
    <Dialog open>
      <DialogContent
        variant="warning"
        data-testid="prometheus-disable-confirm-dialog"
      >
        <DialogHeader>
          <DialogTitle>{t('confirmDisableDialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('confirmDisableDialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onCancel}
            type="button"
            mode="ghost"
            data-testid="prometheus-disable-confirm-dialog-cancel-button"
          >
            {t('confirmDisableDialogCancel')}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            data-testid="prometheus-disable-confirm-dialog-confirm-button"
          >
            {t('confirmDisableDialogConfirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrometheusDisableConfirmDialog;
