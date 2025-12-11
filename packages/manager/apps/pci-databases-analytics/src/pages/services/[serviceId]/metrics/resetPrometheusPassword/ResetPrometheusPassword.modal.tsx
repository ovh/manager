import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  DialogBody,
  Clipboard,
} from '@datatr-ux/uxlib';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import RouteModal from '@/components/route-modal/RouteModal';
import { useResetPrometheusPassword } from '@/hooks/api/database/prometheus/useResetPrometheusPassword.hook';

const ResetPrometheusPassword = () => {
  const { projectId, service } = useServiceData();
  const [newPass, setNewPass] = useState<string>();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const toast = useToast();
  const { resetPrometheusUserPassword, isPending } = useResetPrometheusPassword(
    {
      onError: (err) => {
        toast.toast({
          title: t('resetUserPasswordToastErrorTitle'),
          variant: 'critical',
          description: getCdbApiErrorMessage(err),
        });
      },
      onSuccess: (prometheusAccess) => {
        toast.toast({
          title: t('resetUserPasswordToastSuccessTitle'),
          description: t('resetUserPasswordToastSuccessDescription', {
            name: prometheusAccess.username,
          }),
        });
        setNewPass(prometheusAccess.password);
      },
    },
  );

  const handleResetPassword = () => {
    resetPrometheusUserPassword({
      serviceId: service.id,
      projectId,
      engine: service.engine,
    });
  };

  return (
    <RouteModal>
      <DialogContent variant={`${newPass ? 'information' : 'warning'}`}>
        <DialogHeader>
          <DialogTitle data-testid="reset-password-modal">
            {t('resetUserPasswordTitle')}
          </DialogTitle>
          {!newPass && (
            <DialogDescription>
              {t('resetUserPasswordDescription', { name: 'prometheus' })}
            </DialogDescription>
          )}
        </DialogHeader>

        {newPass && (
          <DialogBody>
            <p>{t('resetUserPasswordSuccess')}</p>
            <Clipboard value={`${newPass}`} secret data-testid="reset-password-copy-button"/>
          </DialogBody>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
              data-testid="reset-password-cancel-button"
            >
              {t('resetUserPasswordButtonCancel')}
            </Button>
          </DialogClose>
          {!newPass && (
            <Button
              type="button"
              disabled={isPending}
              onClick={handleResetPassword}
              data-testid="reset-password-submit-button"
            >
              {t('resetUserPasswordButtonConfirm')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ResetPrometheusPassword;
