import { useTranslation } from 'react-i18next';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';
import onboardingImgSrc from '@/../public/assets/notebooks.png';
import OnboardingTile from './OnboardingTile.component';
import { GUIDES, allGuidesSections, getGuideUrl } from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';

const Onboarding = () => {
  const { t } = useTranslation('pci-ai-notebooks/onboarding');
  const locale = useLocale();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        <Guides section={allGuidesSections} />
      </div>
      <h2>{t('title')}</h2>
      <img
        src={onboardingImgSrc}
        className="max-h-[250px]"
        alt="ai notebooks"
      />
      <p className="font-bold">{t('description1')}</p>
      <p className="font-bold">{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button data-testid="create-notebook-link" asChild>
        <Link
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createNotebookButton')}
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
          href={getGuideUrl(GUIDES.ONBOARDING_TUTO_1, locale)}
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto3Description')}
          content={t('cardTuto3Content')}
          href={getGuideUrl(GUIDES.ONBOARDING_TUTO_2, locale)}
          linkName={t('cardLink')}
        />
      </div>
    </div>
  );
};

export default Onboarding;
