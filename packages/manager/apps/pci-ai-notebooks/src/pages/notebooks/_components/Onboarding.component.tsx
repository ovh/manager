import { useTranslation } from 'react-i18next';
import Guides from '@/components/guides/Guides.component';
import Link from '@/components/links/Link.component';
import { Button } from '@/components/ui/button';

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
      <img src={''} className="max-h-[250px]" alt="ai notebooks" />
      <p>{t('description1')}</p>
      <p className="font-bold">{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button data-testid="create-notebook-link" asChild>
        <Link
          to="new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createNotebookButton')}
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        {/* 
        <OnboardingTile
          title={t('cardGuidestitle')}
          description={t('cardGuidesDescription')}
          content={t('cardGuidesContent')}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardQuickStartTitle')}
          description={t('cardQuickStartDescription')}
          content={t('cardQuickStartContent')}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
          linkName={t('cardLink')}
        />
        <OnboardingTile
          title={t('cardFreeTierTitle')}
          description={t('cardFreeTierTescription')}
          content={t('cardFreeTierContent')}
          href="https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"
          linkName={t('cardLink')}
        />
        */}
      </div>
    </div>
  );
};

export default Onboarding;
