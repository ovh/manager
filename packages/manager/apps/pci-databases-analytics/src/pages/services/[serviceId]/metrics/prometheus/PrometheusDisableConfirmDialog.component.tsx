import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
    <AlertDialog open>
      <AlertDialogContent data-testid="prometheus-disable-confirm-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('confirmDisableDialogTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('confirmDisableDialogDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onCancel}
            data-testid="prometheus-disable-confirm-dialog-cancel-button"
          >
            {t('confirmDisableDialogCancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            data-testid="prometheus-disable-confirm-dialog-confirm-button"
          >
            {t('confirmDisableDialogConfirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PrometheusDisableConfirmDialog;
