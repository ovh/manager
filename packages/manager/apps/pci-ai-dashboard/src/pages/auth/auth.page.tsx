import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  PostMutateAuthorizationProps,
  usePostAuthorization,
} from '@/hooks/api/ai/authorization/usePostAuthorization.hook';

interface AuthProps {
  onSuccess?: () => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const { t } = useTranslation('pci-ai-dashboard/auth');
  const toast = useToast();
  const { projectId } = useParams();

  const PostAuthorizationProps: PostMutateAuthorizationProps = {
    onError(err) {
      toast.toast({
        title: t(`formActiveUserToastErrorTitle`),
        variant: 'destructive',
        description: err.response.data.message,
      });
    },
    onSuccess() {
      toast.toast({
        title: t('formActiveUserToastSuccessTitle'),
        description: t(`formActiveUserToastSuccessDescription`),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
  };

  const { postAuthorization } = usePostAuthorization(PostAuthorizationProps);

  const activateProject = () => {
    postAuthorization({
      projectId,
    });
  };

  return (
    <>
      <div
        data-testid="auth-page-container"
        className="flex flex-col justify-center items-center h-screen gap-4"
      >
        <img></img>
        <h1>{t('authTitle')}</h1>
        <p>{t('authDescription1')}</p>
        <p>{t('authDescription3')}</p>

        <p>{t('authDescription4')}</p>
        <Button
          data-testid="activate-project-button"
          onClick={() => activateProject()}
          className="font-semibold"
          variant="default"
          size="sm"
        >
          {t('authActivateProjectButton')}
        </Button>
      </div>
    </>
  );
}
