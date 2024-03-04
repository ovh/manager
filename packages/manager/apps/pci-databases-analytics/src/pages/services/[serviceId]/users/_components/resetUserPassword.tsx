import { useParams } from 'react-router';
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
import { database } from '@/models/database';
import { GenericUser } from '@/api/databases/users';
import { useResetUserPassword } from '@/hooks/api/users.api.hooks';
import { P } from '@/components/typography';
import { Alert } from '@/components/ui/alert';

interface ResetUserPasswordModalProps {
  service: database.Service;
  controller: ModalController;
  user: GenericUser;
  onSuccess?: (user: GenericUser) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const ResetUserPassword = ({
  service,
  user,
  controller,
  onError,
  onSuccess,
  onCancel,
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
        description: err.message,
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
          <DialogTitle>{t('resetUserPasswordTitle')}</DialogTitle>
          {newPass ? (
            <Alert variant="success">
              <P>{t('resetUserPasswordSuccess')}</P>
              <div className="relative my-4">
                <Button
                  onClick={() => handleCopyPass()}
                  className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
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
              <Button type="button" variant="outline">
                {t('resetUserPasswordButtonClose')}
              </Button>
            </DialogClose>
          ) : (
            <>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCancel()}
                >
                  {t('resetUserPasswordButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                type="button"
                disabled={isPending}
                onClick={handleResetPassword}
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
