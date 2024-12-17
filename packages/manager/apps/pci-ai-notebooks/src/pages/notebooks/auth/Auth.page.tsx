import { useTranslation } from 'react-i18next';
import { redirect, useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
// import {
//   PostMutateAuthorizationProps,
//   usePostAuthorization,
// } from '@/hooks/api/ai/authorization/usePostAuthorization.hook';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OvhLink from '@/components/links/OvhLink.component';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import { PlanCode } from '@/configuration/project';
import {
  PostMutateTestProps,
  useDeleteTest,
  useGetTest,
  usePostTest,
} from '@/hooks/api/test/useTest.hook';
import { TestType } from '@/data/api/test/test.api';
import Link from '@/components/links/Link.component';

export default function Auth() {
  const { t } = useTranslation('pci-ai-notebooks/auth');
  const toast = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const projectData = usePciProject();

  const tests = useGetTest(projectId);

  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;

  // const PostAuthorizationProps: PostMutateAuthorizationProps = {
  const PostTestProps: PostMutateTestProps = {
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

  // const { postAuthorization } = usePostAuthorization(PostAuthorizationProps);
  const { postTest } = usePostTest(PostTestProps);
  const { deleteTest } = useDeleteTest(PostTestProps);

  const activateProject = () => {
    // postAuthorization({
    //   projectId,
    // });

    const test: TestType = {
      delay: 3600,
      email: 'ab@ovhcloud.com',
      monthlyThreshold: 1,
    };
    postTest(test);
  };

  return (
    <>
      {isProjectDiscoveryMode && (
        <Alert variant="warning">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('discoveryMode')}</p>
              </div>
              <Button variant="default" type="button" asChild>
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

        <ul>
          {tests.isSuccess &&
            tests.data.map((test) => (
              <li key={test.id}>
                {test.id}{' '}
                <Button variant="ghost" onClick={() => deleteTest(test)}>
                  <X />
                </Button>
              </li>
            ))}
        </ul>
        {tests.isSuccess && tests.data.length > 0 && (
          <Link to={'../'}>Go to notebooks</Link>
        )}
      </div>
    </>
  );
}
