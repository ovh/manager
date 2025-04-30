import { Button } from '@datatr-ux/uxlib';
import { useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import onboardingImgSrc from '@/../public/assets/onboarding-image.png';
import OnboardingTile from './OnboardingTile.component';

const Onboarding = () => {
  const { t } = useTranslation('dataplatform/services');
  const params = useParams();
  const DATA_PLATFORM_CONFIG_URL =
    'https://hq-api.eu.dataplatform.ovh.net/iam/v4/login?authentication_provider=ovh&project={projectId}&app_id=forepaas&&response_type=token&redirect_uri=https%3A%2F%2Feu.dataplatform.ovh.net&authorize_bypass=true&token_mode=cookie&force_auth=false';
  const replacedDataplatformUrl = DATA_PLATFORM_CONFIG_URL.replace(
    '{projectId}',
    `${params?.projectId}`,
  );

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
      <Button asChild className="mt-2">
        <a href={replacedDataplatformUrl} target="blank">
          {' '}
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
