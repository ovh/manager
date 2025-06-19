import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Computer } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  useToast,
} from '@datatr-ux/uxlib';
import { PlanCode } from '@/configuration/project';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import {
  PostMutateAuthorizationProps,
  usePostAuthorization,
} from '@/data/hooks/ai/authorization/usePostAuthorization.hook';
import OvhLink from '@/components/links/OvhLink.component';
import Onboarding from '../dashboard/home/_components/Onboarding.component';

export default function Auth() {
  const { t } = useTranslation('ai-tools/auth');
  const { t: tNotebooks } = useTranslation('ai-tools/notebooks/onboarding');
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
      navigate('../quantum/notebooks');
    },
  };

  const { postAuthorization } = usePostAuthorization(PostAuthorizationProps);

  const activateProject = () => {
    postAuthorization();
  };

  return (
    <>
      {isProjectDiscoveryMode ? (
        <Alert variant="warning">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="shrink-0 size-6" />
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
      ) : (
        <Alert variant="primary">
          <AlertDescription className="text-base">
            <div
              data-testid="activate-container"
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="shrink-0 size-6" />
                <p>{t('authQuantumDescription')}</p>
              </div>
              <Button
                data-testid="activate-project-button"
                onClick={() => activateProject()}
              >
                {t('authQuantumActivateProjectButton')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Card data-testid="product-life-card">
        <CardHeader>
          <div className="flex flex-row items-center">
            <Computer className="size-4 inline mr-2" />
            <h4>{t('quantumTitle')}</h4>
          </div>
        </CardHeader>
        <CardContent>
          <div className="ml-6">
            <p className="font-semibold">{tNotebooks('quantumDescription1')}</p>
            <p>{tNotebooks('quantumDescription2')}</p>
          </div>
        </CardContent>
      </Card>
      <Onboarding />
    </>
  );
}
