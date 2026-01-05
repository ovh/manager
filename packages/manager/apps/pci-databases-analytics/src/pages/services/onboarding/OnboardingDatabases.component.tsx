import { useMemo } from 'react';
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
import onboardingImgSrc from '@/../public/assets/onboarding-databases.png';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import OnboardingTile from './OnboardingTile.component';
import OnboardingLayout from './OnboardingLayout.component';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { EngineEnum } from '@/types/cloud/project/database';
import A from '@/components/links/A.component';

const OnboardingDatabases = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const track = useTrackAction();
  const { projectId } = useParams<{ projectId: string }>();
  const { data } = useGetAvailabilities(projectId);

  const freeTier = useMemo(
    () =>
      data?.find(
        (avail) =>
          avail.engine === EngineEnum.mongodb && avail.plan === 'discovery',
      ),
    [data],
  );

  const descriptionsKeys = [
    'databases.description1',
    'databases.description2',
    'databases.description3',
  ];

  return (
    <OnboardingLayout
      title={t('databases.title')}
      subtitle={t('databases.subtitle')}
      imageSrc={onboardingImgSrc}
      imageAlt="managed database service"
      descriptionsKeys={descriptionsKeys}
      createButtonText={t('databases.createServiceButton')}
      createButtonLink="../new"
      createButtonTestId="create-database-service-link"
    >
      <OnboardingTile
        title={t('databases.tile.quickStart.title')}
        href="https://docs.ovh.com/gb/en/publiccloud/databases/"
        linkName={t('common.cardLink')}
      >
        <p>{t('databases.tile.quickStart.content')}</p>
      </OnboardingTile>

      <OnboardingTile
        title={t('databases.tile.documentation.title')}
        href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
        linkName={t('common.cardLink')}
      >
        <p>{t('databases.tile.documentation.content')}</p>
      </OnboardingTile>

      <Card className="flex flex-col justify-between">
        <CardHeader className="py-4">
          <CardTitle>{t('databases.tile.freeTier.title')}</CardTitle>
        </CardHeader>

        <CardContent className="pb-4">
          <p>{t('databases.tile.freeTier.content')}</p>

          <A
            href="https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="inline-flex items-center gap-2">
              <span>{t('common.cardLink')}</span>
              <ExternalLink className="size-4" />
            </div>
          </A>
        </CardContent>

        <CardFooter>
          {freeTier && (
            <Button
              data-testid="create-service-link-freetier"
              asChild
              size="sm"
            >
              <Link
                onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
                to={`../new?STEP_1=${freeTier.engine}&STEP_2=${freeTier.plan}&STEP_3=${freeTier.region}`}
                className="hover:no-underline hover:text-primary-foreground"
              >
                {t('databases.tile.freeTier.cta')}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </OnboardingLayout>
  );
};

export default OnboardingDatabases;
