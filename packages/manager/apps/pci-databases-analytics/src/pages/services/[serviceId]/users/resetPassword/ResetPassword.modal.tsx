import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
  Code,
  githubDark,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@datatr-ux/uxlib';
import { useResetUserPassword } from '@/hooks/api/database/user/useResetUserPassword.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import * as database from '@/types/cloud/project/database';

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
  const [selectedEndpoint, setSelectedEndpoint] = useState<
    database.service.Endpoint | undefined
  >(service.endpoints[0]);

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

  return (
    <RouteModal isLoading={!users}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="reset-password-modal">
            {t('resetUserPasswordTitle')}
          </DialogTitle>
          {newPass ? (
            <div data-testid="pwd-connection-info">
              <p>{t('resetUserPasswordSuccess')}</p>
              <div data-testid="code-pwd-container" className="p-2">
                <Code
                  code={newPass}
                  label={t('resetUserPasswordCode')}
                  theme={githubDark}
                  onCopied={() =>
                    toast.toast({
                      title: t('resetUserPasswordCopy'),
                    })
                  }
                />
              </div>
              <p>{t('resetUserConnectionTitle')}</p>
              <div data-testid="code-uri-container" className="p-2">
                {service.endpoints.length > 1 && (
                  <Select
                    value={selectedEndpoint?.component}
                    onValueChange={(v) =>
                      setSelectedEndpoint(
                        service.endpoints.find(
                          (endpoint) => endpoint.component === v,
                        ),
                      )
                    }
                  >
                    <SelectTrigger
                      data-testid="dashboard-connection-detail-select"
                      className="h-8 mb-3"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {service.endpoints.map((ep) => (
                        <SelectItem key={ep.component} value={ep.component}>
                          {ep.component}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Code
                  code={selectedEndpoint?.uri.replace(
                    '<username>:<password>',
                    `${user.username.replace(/@.*/, '')}:${newPass}`,
                  )}
                  label={t('resetUserConnectionCode')}
                  theme={githubDark}
                  onCopied={() =>
                    toast.toast({
                      title: t('resetUserConnectionCodeCopy'),
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <DialogDescription>
              {t('resetUserPasswordDescription', { name: user?.username })}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="flex justify-end">
          {newPass ? (
            <DialogClose asChild>
              <Button
                type="button"
                mode="outline"
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
                  mode="outline"
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

export default ResetUserPassword;
