import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Code,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  docker,
  githubDark,
  useToast,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useRenewToken } from '@/data/hooks/ai/token/useRenewToken.hook';
import RouteModal from '@/components/route-modal/RouteModal';
import { useGetToken } from '@/data/hooks/ai/token/useGetToken.hook';

const RenewToken = () => {
  const [newTokenValue, setNewTokenValue] = useState<string>();
  const { projectId, tokenId: idToken } = useParams();
  const navigate = useNavigate();
  const tokenQuery = useGetToken(projectId, idToken);
  const { t } = useTranslation('ai-tools/dashboard/tokens');
  const toast = useToast();
  const { renewToken, isPending } = useRenewToken({
    onError: (err) => {
      toast.toast({
        title: t('renewTokenToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onAddEditSuccess: (newToken) => {
      toast.toast({
        title: t('renewTokenToastSuccessTitle'),
        description: t('renewTokenToastSuccessDescription', {
          name: tokenQuery.data?.spec.name,
        }),
      });
      setNewTokenValue(newToken.status.value);
    },
  });

  const handleRenew = () => {
    renewToken({
      projectId,
      tokenId: idToken,
    });
  };

  const handleClose = () => navigate('../');

  return (
    <RouteModal backUrl="../" isLoading={!tokenQuery.isSuccess}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="renew-token-modal">
            {t('renewTokenTitle')}
          </DialogTitle>
          {!newTokenValue && (
            <DialogDescription>
              {t('renewTokenDescription', {
                name: tokenQuery.data?.spec.name,
              })}
            </DialogDescription>
          )}
        </DialogHeader>
        {newTokenValue ? (
          <div>
            <p>{t('renewTokenSuccess')}</p>
            <div data-testid="code-container" className="p-2">
              <Code
                code={newTokenValue}
                label={t('formUserLabel')}
                lang={docker}
                theme={githubDark}
                onCopied={() =>
                  toast.toast({
                    title: t('formUserPasswordCopy'),
                  })
                }
              />
            </div>
            <DialogFooter className="flex justify-end mt-4">
              <DialogClose asChild onClick={() => handleClose()}>
                <Button
                  data-testid="renew-token-close-button"
                  type="button"
                  mode="outline"
                >
                  {t('renewTokenButtonClose')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <div>
            <DialogFooter className="flex justify-end">
              <DialogClose asChild>
                <Button
                  data-testid="renew-token-cancel-button"
                  type="button"
                  mode="outline"
                >
                  {t('renewTokenButtonCancel')}
                </Button>
              </DialogClose>
              <Button
                data-testid="renew-token-submit-button"
                type="button"
                disabled={isPending}
                onClick={handleRenew}
              >
                {t('renewTokenButtonConfirm')}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </RouteModal>
  );
};

export default RenewToken;
