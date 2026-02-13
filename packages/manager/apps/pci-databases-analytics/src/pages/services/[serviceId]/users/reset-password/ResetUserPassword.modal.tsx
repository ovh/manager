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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DialogBody,
  Clipboard,
} from '@datatr-ux/uxlib';
import { useResetUserPassword } from '@/data/hooks/database/user/useResetUserPassword.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { useServiceData } from '../../Service.context';
import { useGetUsers } from '@/data/hooks/database/user/useGetUsers.hook';
import RouteModal from '@/components/route-modal/RouteModal.component';
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
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: (userWithPassword) => {
      toast.toast({
        title: t('userSuccessTitle'),
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
      <DialogContent
        variant={`${newPass ? 'information' : 'warning'}`}
        data-testid="code-pwd-container"
      >
        <DialogHeader>
          <DialogTitle data-testid="reset-password-modal">
            {t('resetUserPasswordTitle')}
          </DialogTitle>
          {!newPass && (
            <DialogDescription>
              {t('resetUserPasswordDescription', { name: user?.username })}
            </DialogDescription>
          )}
        </DialogHeader>
        {newPass && (
          <DialogBody>
            <div data-testid="pwd-connection-info">
              <p>{t('resetUserPasswordSuccess')}</p>
              <div className="my-2">
                <p className="font-semibold">{t('resetUserPasswordCode')}</p>
                <Clipboard value={`${newPass}`} />
              </div>
              <p>{t('resetUserConnectionTitle')}</p>
              <div data-testid="code-uri-container">
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
                    <SelectTrigger data-testid="dashboard-connection-detail-select">
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
                <div className="my-2">
                  <p className="font-semibold">
                    {t('resetUserConnectionCode')}
                  </p>
                  <Clipboard
                    value={`${selectedEndpoint?.uri.replace(
                      '<username>:<password>',
                      `${encodeURIComponent(
                        user.username.replace(/@.*/, ''),
                      )}:${encodeURIComponent(newPass)}`,
                    )}`}
                  />
                </div>
              </div>
            </div>
          </DialogBody>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              mode="ghost"
              data-testid="reset-password-close-button"
            >
              {t(newPass ? 'userCloseButton' : 'userCancelButton')}
            </Button>
          </DialogClose>
          {!newPass && (
            <Button
              type="button"
              disabled={isPending}
              onClick={handleResetPassword}
              data-testid="reset-password-submit-button"
            >
              {t('userConfirmButton')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </RouteModal>
  );
};

export default ResetUserPassword;
