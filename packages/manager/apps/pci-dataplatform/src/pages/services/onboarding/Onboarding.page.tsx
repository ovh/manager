import { Button, Alert, AlertDescription } from '@datatr-ux/uxlib';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import onboardingImgSrc from '@/../public/assets/onboarding-image.png';
import OnboardingTile from './OnboardingTile.component';
import usePciProject from '@/hooks/api/project/usePciProject.hook';
import { PlanCode } from '@/types/cloud/Project';
import Link from '@/components/links/Link.component';

const Onboarding = () => {
  const { t } = useTranslation('dataplatform/services');
  const params = useParams();
  const DATA_PLATFORM_CONFIG_URL = `https://hq-api.eu.dataplatform.ovh.net/iam/v4/login?authentication_provider=ovh&project=${params?.projectId}&app_id=forepaas&&response_type=token&redirect_uri=https%3A%2F%2Feu.dataplatform.ovh.net&authorize_bypass=true&token_mode=cookie&force_auth=false`;
  const projectData = usePciProject();
  const isProjectDiscoveryMode =
    projectData.data?.planCode === PlanCode.DISCOVERY;

  return (
    <div
      data-testid="onboarding-container-test"
      className="flex flex-col items-center gap-4"
    >
      <img
        src={onboardingImgSrc}
        className="max-w-[500px]"
        alt="dataplatform-image"
      />
      <h2>{t('title')}</h2>
      <div>
        <Trans
          t={t}
          i18nKey={'description_top'}
          components={{
            b: <b className="font-bold"></b>,
          }}
        ></Trans>
      </div>
      <div>
        <Trans
          t={t}
          i18nKey={'description_bottom'}
          components={{
            b: <b className="font-bold"></b>,
          }}
        ></Trans>
      </div>
      {isProjectDiscoveryMode && (
        <Alert variant="warning">
          <AlertDescription className="text-base">
            <div
              data-testid="discovery-container"
              className="flex flex-col items-stretch  md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex flex-row gap-5 items-center">
                <AlertCircle className="h-6 w-6 text-[#995400]" />
                <p className="text-[#995400]">{t('discoveryMode')}</p>
              </div>
              <Button type="button" asChild>
                <Link
                  className="hover:no-underline hover:text-primary-foreground"
                  to={`#/pci/projects/${projectData.data?.project_id}/activate`}
                >
                  {t('discoveryModeActivate')}
                  <ArrowRight className="w-4 h-4 ml-2 mt-1" />
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      <Button className="mt-2" disabled={isProjectDiscoveryMode}>
        <a href={DATA_PLATFORM_CONFIG_URL} target="blank">
          {t('button_text')}
        </a>
      </Button>
      <h3 className="mt-8">{t('card_section_title')}</h3>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <OnboardingTile
          title={t('card_top_guide')}
          description={t('card_left_title')}
          content={t('card_left_description')}
          href="https://docs.dataplatform.ovh.net/#/en/getting-started/index"
          linkName={t('card_find_out_more')}
        />
        <OnboardingTile
          title={t('card_top_guide')}
          description={t('card_middle_title')}
          content={t('card_middle_description')}
          href="https://docs.dataplatform.ovh.net/#/en/getting-further/index"
          linkName={t('card_find_out_more')}
        />
        <OnboardingTile
          title={t('card_top_guide')}
          description={t('card_right_title')}
          content={t('card_right_description')}
          href="https://docs.dataplatform.ovh.net/#/en/"
          linkName={t('card_find_out_more')}
        />
      </div>
    </div>
  );
};

export default Onboarding;
