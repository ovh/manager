import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, Button, useToast } from '@datatr-ux/uxlib';
import { PlanCode } from '@/configuration/project';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import {
  PostMutateAuthorizationProps,
  usePostAuthorization,
} from '@/data/hooks/ai/authorization/usePostAuthorization.hook';
import OvhLink from '@/components/links/OvhLink.component';

export default function Auth() {
  const { t } = useTranslation('ai-tools/auth');
  const toast = useToast();
  const navigate = useNavigate();
  const projectData = usePciProject();

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;

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
      navigate('../');
    },
  };

  const { postAuthorization } = usePostAuthorization(PostAuthorizationProps);

  const activateProject = () => {
    postAuthorization();
  };

  return (
    <>
      {isProjectDiscoveryMode && (
        <Alert className="bg-warning-100">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-row md:flex-col items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('discoveryMode')}</p>
              </div>

              <Button variant="primary" mode="default" type="button" asChild>
                <OvhLink
                  className="hover:no-underline hover:text-primary-foreground"
                  application="public-cloud"
                  path={`#/pci/projects/${projectData.data?.project_id}/activate`}
                >
                  {t('discoveryModeActivate')}
                  <ArrowRight className="w-4 h-4 ml-2 mt-1" />
                </OvhLink>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <div
        data-testid="auth-page-container"
        className="flex flex-col justify-center items-center h-screen gap-4"
      >
        <h1>{t('authTitle')}</h1>
        <p>{t('authDescription')}</p>
        <Button
          data-testid="activate-project-button"
          onClick={() => activateProject()}
          className="font-semibold"
          variant="neutral"
          size="sm"
        >
          {t('authActivateProjectButton')}
        </Button>
      </div>
    </>
  );
}
