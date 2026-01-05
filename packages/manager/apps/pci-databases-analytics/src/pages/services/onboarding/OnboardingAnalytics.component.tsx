import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import onboardingImgSrc from '@/../public/assets/onboarding-analytics.png';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import OnboardingTile from './OnboardingTile.component';

const OnboardingAnalytics = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const track = useTrackAction();

  const descriptionsKeys = [
    'analytics.description1',
    'analytics.description2',
    'analytics.description3',
  ];

  return (
    <div
      data-testid="onboarding-container"
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

      <div className="flex flex-col items-center text-center gap-4 max-w-8xl">
        <h1>{t('analytics.title')}</h1>
        <h4>{t('analytics.subtitle')}</h4>

        <img
          src={onboardingImgSrc}
          className="max-h-[250px]"
          alt="managed analytics service"
        />

        {descriptionsKeys.map((key) => (
          <p key={key}>
            <Trans
              i18nKey={key}
              ns="pci-databases-analytics/services/onboarding"
              components={{ strong: <strong /> }}
            />
          </p>
        ))}
      </div>

      <Button data-testid="create-analytic-service-link" size="lg" asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('analytics.createServiceButton')}
        </Link>
      </Button>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <OnboardingTile
          title={t('analytics.tile.quickStart.title')}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/"
          linkName={t('common.cardLink')}
        >
          <p>{t('analytics.tile.quickStart.content')}</p>
        </OnboardingTile>

        <OnboardingTile
          title={t('analytics.tile.documentation.title')}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
          linkName={t('common.cardLink')}
        >
          <p>{t('analytics.tile.documentation.content')}</p>
        </OnboardingTile>

        <OnboardingTile
          title={t('analytics.tile.integrations.title')}
          href="https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"
          linkName={t('common.cardLink')}
        >
          <p>{t('analytics.tile.integrations.content')}</p>
        </OnboardingTile>
      </div>
    </div>
  );
};

export default OnboardingAnalytics;
