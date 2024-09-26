import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalController } from '@/hooks/useModale';
import { useToast } from '@/components/ui/use-toast';
import * as database from '@/types/cloud/project/database';
import { GenericUser } from '@/data/api/database/user.api';
import { useResetUserPassword } from '@/hooks/api/database/user/useResetUserPassword.hook';
import { Alert } from '@/components/ui/alert';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

interface ResetUserPasswordModalProps {
  service: database.Service;
  controller: ModalController;
  user: GenericUser;
  onSuccess?: (user: GenericUser) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

const ResetUserPassword = ({
  service,
  user,
  controller,
  onError,
  onSuccess,
  onClose,
}: ResetUserPasswordModalProps) => {
  // import translations
  const [newPass, setNewPass] = useState<string>();
  const { projectId } = useParams();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/users',
  );
  const toast = useToast();
  const { resetUserPassword, isPending } = useResetUserPassword({
    onError: (err) => {
      toast.toast({
        title: t('resetUserPasswordToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (userWithPassword) => {
      toast.toast({
        title: t('resetUserPasswordToastSuccessTitle'),
        description: t('resetUserPasswordToastSuccessDescription', {
          name: userWithPassword.username,
        }),
      });
      setNewPass(userWithPassword.password);
      if (onSuccess) {
        onSuccess(user);
      }
    },
  });

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleResetPassword = () => {
    resetUserPassword({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      userId: user.id,
    });
  };
  const handleCopyPass = () => {
    navigator.clipboard.writeText(newPass);
    toast.toast({
      title: t('resetUserPasswordCopy'),
    });
  };

  return (
    <Dialog {...controller}>
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
              {t('resetUserPasswordDescription', { name: user.username })}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          {newPass ? (
            <DialogClose asChild onClick={() => onClose()}>
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
                  onClick={handleClose}
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
    </Dialog>
  );
};

export default ResetUserPassword;
