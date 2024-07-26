import { useTranslation } from 'react-i18next';
import onboardingImgSrc from '@/../public/assets/onboarding-image.png';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import { Button } from '@/components/ui/button';
import Link from '@/components/links/Link.component';
import { useTrackPage, useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import OnboardingTile from './OnboardingTile.component';

const Onboarding = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  useTrackPage(TRACKING.onboarding.page());
  const track = useTrackAction();

  return (
    <div
      data-testid="onbaording-container"
      className="flex flex-col items-center gap-4"
    >
      <div className="w-full text-right">
        <Guides
          section={GuideSections.onboarding}
          noEngineFilter
          onGuideClick={(guide) =>
            track(TRACKING.onboarding.guideClick(guide.title))
          }
        />
      </div>
      <h2>{t('title')}</h2>
      <img
        src={onboardingImgSrc}
        className="max-h-[250px]"
        alt="managed database service"
      />
      <p>{t('description1')}</p>
      <p className="font-bold">{t('description2')}</p>
      <p>{t('description3')}</p>
      <Button data-testid="create-service-link" asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('createServiceButton')}
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
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
      </div>
    </div>
  );
};

export default Onboarding;
