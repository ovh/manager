import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { useResetUserPassword } from '@/hooks/api/database/user/useResetUserPassword.hook';
import { Alert } from '@/components/ui/alert';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { Skeleton } from '@/components/ui/skeleton';

const ResetUserPassword = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { projectId, service } = useServiceData();
  const usersQuery = useGetUsers(projectId, service.engine, service.id, {
    enabled: !!service.id,
  });
  const users = usersQuery.data;
  const user = users?.find((u) => u.id === userId);

  const [newPass, setNewPass] = useState<string>();
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
    },
    onSuccess: (userWithPassword) => {
      toast.toast({
        title: t('resetUserPasswordToastSuccessTitle'),
        description: t('resetUserPasswordToastSuccessDescription', {
          name: userWithPassword.username,
        }),
      });
      setNewPass(userWithPassword.password);
      navigate('../');
    },
  });

  useEffect(() => {
    if (users && !user) navigate('../');
  }, [users, user]);

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

  const onOpenChange = (open: boolean) => {
    if (!open) navigate('../');
  };

  if (!users) return <Skeleton className="w-full h-4" />;
  return (
    <Dialog defaultOpen onOpenChange={onOpenChange}>
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
    </Dialog>
  );
};

export default ResetUserPassword;
