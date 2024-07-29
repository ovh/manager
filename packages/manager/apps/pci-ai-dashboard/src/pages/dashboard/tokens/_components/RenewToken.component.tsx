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
import { useToast } from '@/components/ui/use-toast';

import { ModalController } from '@/hooks/useModale.hook';
import * as ai from '@/types/cloud/project/ai';
import { useRenewToken } from '@/hooks/api/ai/token/useRenewToken.hook';
import { Alert } from '@/components/ui/alert';

interface RenewTokenModalProps {
  token: ai.token.Token;
  controller: ModalController;
  onSuccess?: (token: ai.token.Token) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

const RenewToken = ({
  token,
  controller,
  onError,
  onSuccess,
  onClose,
}: RenewTokenModalProps) => {
  const [newTokenValue, setNewTokenValue] = useState<string>();
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard/tokens');
  const toast = useToast();
  const { renewToken, isPending } = useRenewToken({
    onError: (err) => {
      toast.toast({
        title: t('renewTokenToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (onError) {
        onError(err);
      }
    },
    onSuccess: (newToken) => {
      toast.toast({
        title: t('renewTokenToastSuccessTitle'),
        description: t('renewTokenToastSuccessDescription', {
          name: token.spec.name,
        }),
      });
      setNewTokenValue(newToken.status.value);
      if (onSuccess) {
        onSuccess(token);
      }
    },
  });

  const handleRenew = () => {
    renewToken({
      projectId,
      tokenId: token.id,
    });
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(newTokenValue);
    toast.toast({
      title: t('renewTokenCopy'),
    });
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog {...controller}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="renew-token-modal">
            {t('renewTokenTitle')}
          </DialogTitle>
          {!newTokenValue && (
            <DialogDescription>
              {t('renewTokenDescription', {
                name: token.spec.name,
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
                  variant="outline"
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
                  variant="outline"
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
    </Dialog>
  );
};

export default RenewToken;
