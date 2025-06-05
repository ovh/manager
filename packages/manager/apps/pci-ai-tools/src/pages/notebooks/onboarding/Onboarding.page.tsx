import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { useParams } from 'react-router-dom';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import onboardingImgSrc from '@/../public/assets/notebooks.png';
import onboardingQuantumImgSrc from '@/../public/assets/quantum-notebooks.png';
import {
  GUIDES,
  getGuideUrl,
  notebookGuidesSections,
} from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import OnboardingTile from '@/components/onboarding-tile/OnboardingTile.component';

const Onboarding = () => {
  const { t } = useTranslation('ai-tools/notebooks/onboarding');
  const locale = useLocale();
  const { quantum } = useParams();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        {quantum !== 'quantum' && <Guides section={notebookGuidesSections} />}
      </div>
      <h2>{quantum === 'quantum' ? t('quantumTitle') : t('title')}</h2>
      <img
        src={quantum === 'quantum' ? onboardingQuantumImgSrc : onboardingImgSrc}
        className="max-h-[250px]"
        alt="ai notebooks"
      />
      <p className="font-bold">
        {quantum === 'quantum' ? t('quantumDescription1') : t('description1')}
      </p>
      {quantum !== 'quantum' && (
        <p className="font-bold">{t('description2')}</p>
      )}

      <p>
        {quantum === 'quantum' ? t('quantumDescription2') : t('description3')}
      </p>
      {quantum === 'quantum' && <p>{t('quantumDescription3')}</p>}
      <Button data-testid="create-notebook-link" asChild>
        <Link
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createNotebookButton')}
        </Link>
      </Button>
      {quantum !== 'quantum' && (
        <div className="grid grid-cols-1 md:grid md:grid-cols-3 gap-2">
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
            href={getGuideUrl(GUIDES.NOTEBOOK_ONBOARDING_TUTO_1, locale)}
            linkName={t('cardLink')}
          />
          <OnboardingTile
            title={t('cardTutotitle')}
            description={t('cardTuto3Description')}
            content={t('cardTuto3Content')}
            href={getGuideUrl(GUIDES.NOTEBOOK_ONBOARDING_TUTO_2, locale)}
            linkName={t('cardLink')}
          />
        </div>
      )}
    </div>
  );
};

export default Onboarding;
