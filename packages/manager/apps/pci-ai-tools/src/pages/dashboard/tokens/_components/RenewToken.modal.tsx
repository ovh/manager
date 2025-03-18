import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy } from 'lucide-react';
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

  const handleCopyPass = () => {
    navigator.clipboard.writeText(newTokenValue);
    toast.toast({
      title: t('renewTokenCopy'),
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
            <Alert variant="success">
              <p>{t('renewTokenSuccess')}</p>
              <div className="relative my-2 rounded bg-gray-100">
                <Button
                  data-testid="renew-token-copy-button"
                  onClick={() => handleCopyPass()}
                  className="absolute top-0 right-0 m-2 p-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 transition duration-300"
                >
                  <Copy className="size-4" />
                  <span className="sr-only">copy</span>
                </Button>
                <pre className="p-4 bg-gray-100 rounded max-w-sm overflow-auto">
                  <code>{newTokenValue}</code>
                </pre>
              </div>
            </Alert>
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
