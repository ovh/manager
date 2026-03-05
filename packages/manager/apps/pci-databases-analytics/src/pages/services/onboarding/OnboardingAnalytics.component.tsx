import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@datatr-ux/uxlib';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import onboardingImgSrc from '@/../public/assets/onboarding-analytics.png';
import OnboardingTile from './OnboardingTile.component';
import OnboardingLayout from './OnboardingLayout.component';
import OvhLink from '@/components/links/OvhLink.component';
import { useTrackAction } from '@/hooks/useTracking.hook';
import { TRACKING } from '@/configuration/tracking.constants';

const OnboardingAnalytics = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const { projectId } = useParams<{ projectId: string }>();
  const track = useTrackAction();

  const descriptionsKeys = [
    'analytics.description1',
    'analytics.description2',
    'analytics.description3',
  ];

  return (
    <OnboardingLayout
      title={t('analytics.title')}
      subtitle={t('analytics.subtitle')}
      imageSrc={onboardingImgSrc}
      imageAlt="managed analytics service"
      descriptionsKeys={descriptionsKeys}
      createButtonText={t('analytics.createServiceButton')}
      createButtonLink="../new"
      createButtonTestId="create-analytic-service-link"
    >
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

      <Card className="flex flex-col justify-between">
        <CardHeader className="py-4">
          <CardTitle>{t('analytics.tile.integrations.title')}</CardTitle>
        </CardHeader>

        <CardContent className="pb-4">
          <p>{t('analytics.tile.integrations.content')}</p>
        </CardContent>

        <CardFooter>
          <Button data-testid="analytics-integrations-cta" asChild size="sm">
            <OvhLink
              className="hover:text-white hover:no-underline"
              application="public-cloud"
              path={`#/pci/projects/${projectId}/databases-analytics/operational/services`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
            >
              <div className="inline-flex items-center gap-2">
                <span>{t('analytics.tile.integrations.cta')}</span>
                <ExternalLink className="size-4" />
              </div>
            </OvhLink>
          </Button>
        </CardFooter>
      </Card>
    </OnboardingLayout>
  );
};

export default OnboardingAnalytics;
