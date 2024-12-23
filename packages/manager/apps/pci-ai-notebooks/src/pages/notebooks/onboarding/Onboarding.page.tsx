import { useTranslation } from 'react-i18next';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';
import onboardingImgSrc from '@/../public/assets/notebooks.png';
import OnboardingTile from './OnboardingTile.component';

const Onboarding = () => {
  const { t } = useTranslation('pci-ai-notebooks/onboarding');

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        <Guides />
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
          title={t('cardTutotitle')}
          description={t('cardTuto1Description')}
          content={t('cardTuto1Content')}
          href="https://docs.ovh.com/gb/en/publiccloud/ai/"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto2Description')}
          content={t('cardTuto2Content')}
          href="https://docs.ovh.com/gb/en/publiccloud/ai/ai-comparative-tables/"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto3Description')}
          content={t('cardTuto3Content')}
          href="https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/definition/"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto4Description')}
          content={t('cardTuto4Content')}
          href="https://docs.ovh.com/gb/en/publiccloud/ai/cli/sharing-notebooks/"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardTutotitle')}
          description={t('cardTuto5Description')}
          content={t('cardTuto5Content')}
          href="https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/tuto-access-object-storage-data/"
          linkName={t('cardLink')}
        />
      </div>
    </div>
  );
};

export default Onboarding;
