import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import onboardingImgSrc from '@/../public/assets/training.png';
import { GUIDES, getGuideUrl, jobGuidesSections } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import OnboardingTile from '@/components/onboarding-tile/OnboardingTile.component';

const Onboarding = () => {
  const { t } = useTranslation('ai-tools/jobs/onboarding');
  const locale = useLocale();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        <Guides section={jobGuidesSections} />
      </div>
      <h2>{t('title')}</h2>
      <img src={onboardingImgSrc} className="max-h-[250px]" alt="ai training" />
      <p className="font-bold">{t('description1')}</p>
      <p className="font-bold">{t('description2')}</p>
      <p>{t('description3')}</p>
      <p>{t('description4')}</p>
      <Button data-testid="create-job-link" asChild>
        <Link
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createJobButton')}
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <OnboardingTile
          title={t('cardGuidetitle')}
          description={t('cardTuto1Description')}
          content={t('cardTuto1Content')}
          href={getGuideUrl(GUIDES.GLOBAL_AI, locale)}
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto2Description')}
          content={t('cardTuto2Content')}
          href={getGuideUrl(GUIDES.JOB_ONBOARDING_TUTO_1, locale)}
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto3Description')}
          content={t('cardTuto3Content')}
          href={getGuideUrl(GUIDES.JOB_ONBOARDING_TUTO_2, locale)}
          linkName={t('cardLink')}
        />
      </div>
    </div>
  );
};

export default Onboarding;
