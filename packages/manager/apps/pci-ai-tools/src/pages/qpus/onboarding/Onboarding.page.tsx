import { Button } from '@datatr-ux/uxlib';
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
import { useQuantum } from '@/hooks/useQuantum.hook';

const Onboarding = () => {
  const { isQuantum, t } = useQuantum('ai-tools/qpus/onboarding');
  const locale = useLocale();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <h2>{t('title')}</h2>
      <img
        src={onboardingQuantumImgSrc}
        className="max-h-[250px]"
        alt="ai QPUs"
      />
      <p className="font-bold">{t('description1')}</p>
      <p>{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button data-testid="create-notebook-link" asChild>
        <Link
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createNotebookButton')}
        </Link>
      </Button>
    </div>
  );
};

export default Onboarding;
