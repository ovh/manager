import { Button } from '@datatr-ux/uxlib';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import onboardingImgSrc from '@/../public/assets/notebooks.png';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import onboardingQuantumImgSrc from '@/../public/assets/quantum-notebooks.png';
import {
  GUIDES,
  getGuideUrl,
  notebookGuidesSections,
} from '@/configuration/guide';
import { useLocale } from '@/hooks/useLocale';
import OnboardingTile from '@/components/onboarding-tile/OnboardingTile.component';
import { useQuantum } from '@/hooks/useQuantum.hook';

const track = useTrackAction();
const Onboarding = () => {
  const { isQuantum, t } = useQuantum('ai-tools/notebooks/onboarding');
  const locale = useLocale();
  const track = useTrackAction();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        {!isQuantum && <Guides section={notebookGuidesSections} />}
      </div>
      <h2>{t('title')}</h2>
      <img
        src={isQuantum ? onboardingQuantumImgSrc : onboardingImgSrc}
        className="max-h-[250px]"
        alt="ai notebooks"
      />
      <p className="font-bold">{t('description1')}</p>
      <p>{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button data-testid="create-notebook-link" asChild>
        <Link
          onClick={() => {
            track(
              TRACKING.notebooks.onboarding.createNotebookClick(),
              'onboarding',
            );
          }}
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createNotebookButton')}
        </Link>
      </Button>
      {!isQuantum && (
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
