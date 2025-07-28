import { Button } from '@datatr-ux/uxlib';
import Link from '@/components/links/Link.component';
import onboardingQuantumImgSrc from '@/../public/assets/quantum-notebooks.png';
import { useQuantum } from '@/hooks/useQuantum.hook';

const Onboarding = () => {
  const { t } = useQuantum('ai-tools/qpu/onboarding');

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <h2>{t('Title')}</h2>
      <img src={onboardingQuantumImgSrc} className="max-h-[250px]" />
      <p className="font-bold">{t('Description1')}</p>
      <p>{t('Description2')}</p>
      <p>{t('Description3')}</p>
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
