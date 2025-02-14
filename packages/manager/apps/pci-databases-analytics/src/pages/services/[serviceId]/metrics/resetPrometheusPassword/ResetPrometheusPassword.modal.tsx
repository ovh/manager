import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Alert } from '@/components/ui/alert';
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
          variant: 'destructive',
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
  const handleCopyPass = () => {
    navigator.clipboard.writeText(newPass);
    toast.toast({
      title: t('resetUserPasswordCopy'),
    });
  };

  return (
    <RouteModal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="reset-password-modal">
            {t('resetUserPasswordTitle')}
          </DialogTitle>
          {newPass ? (
            <Alert variant="success">
              <p>{t('resetUserPasswordSuccess')}</p>
              <div className="relative my-4">
                <Button
                  onClick={() => handleCopyPass()}
                  className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
                  data-testid="reset-password-copy-button"
                >
                  <Copy className="size-4" />
                  <span className="sr-only">copy</span>
                </Button>
                <pre className="p-4 bg-gray-100 rounded">
                  <code>{newPass}</code>
                </pre>
              </div>
            </Alert>
          ) : (
            <DialogDescription>
              {t('resetUserPasswordDescription', { name: 'prometheus' })}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          {newPass ? (
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                data-testid="reset-password-close-button"
              >
                {t('resetUserPasswordButtonClose')}
              </Button>
            </DialogClose>
          ) : (
            <>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  data-testid="reset-password-cancel-button"
                >
                  {t('resetUserPasswordButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isPending}
                onClick={handleResetPassword}
                data-testid="reset-password-submit-button"
              >
                {t('resetUserPasswordButtonConfirm')}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ResetPrometheusPassword;
