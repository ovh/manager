import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';
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
import storeImage from '@/../public/assets/stock.png';
import exploreImage from '@/../public/assets/explore.png';
import trainImage from '@/../public/assets/train.png';
import deployImage from '@/../public/assets/serve.png';
import ProductInformations from '../dashboard/home/_components/ProductInformations.component';
import Onboarding from '../dashboard/home/_components/Onboarding.component';

export default function Auth() {
  const { t } = useTranslation('ai-tools/dashboard/home');
  const { projectId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const projectData = usePciProject();
  const objectStoragePath = `/pci/projects/${projectId}/storages/objects`;
  const notebooksPath = '../notebooks';
  const jobsPath = `/pci/projects/${projectId}/training/jobs`;
  const appsPath = `/pci/projects/${projectId}/ai/apps`;

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
      {isProjectDiscoveryMode ? (
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
      ) : (
        <Alert className="bg-blue-100">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-row md:flex-col items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6" />
                <p>{t('authDescription')}</p>
              </div>
              <Button
                data-testid="activate-project-button"
                onClick={() => activateProject()}
                className="font-semibold"
              >
                {t('authActivateProjectButton')}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Card data-testid="product-life-card">
        <CardHeader>
          <div className="flex flex-row items-center">
            <BrainCircuit className="size-4 inline mr-2" />
            <h4>{t('onboardingTitle')}</h4>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 content-end">
            <ProductInformations
              img={storeImage}
              isInternalAppLink={false}
              link={objectStoragePath}
              title={t('store-title')}
              productName={t('object-storage-title')}
              showConsumptionInfos={false}
            />
            <ProductInformations
              img={exploreImage}
              isInternalAppLink={true}
              link={notebooksPath}
              title={t('explore-title')}
              productName={t('notebooks-title')}
              showConsumptionInfos={false}
            />
            <ProductInformations
              img={trainImage}
              link={jobsPath}
              isInternalAppLink={false}
              title={t('train-title')}
              productName={t('training-title')}
              showConsumptionInfos={false}
            />
            <ProductInformations
              img={deployImage}
              isInternalAppLink={false}
              link={appsPath}
              title={t('deploy-title')}
              productName={t('ai-deploy-title')}
              showConsumptionInfos={false}
            />
          </div>
        </CardContent>
      </Card>
      <Onboarding />
    </>
  );
}
