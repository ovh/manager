import { Trans, useTranslation } from 'react-i18next';
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
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import OnboardingTile from './OnboardingTile.component';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';
import { EngineEnum } from '@/types/cloud/project/database';
import A from '@/components/links/A.component';

const OnboardingDatabases = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const track = useTrackAction();
  const { projectId } = useParams();
  const { data } = useGetAvailabilities(projectId);

  const freeTier = data?.find(
    (avail) =>
      avail.engine === EngineEnum.mongodb && avail.plan === 'discovery',
  );

  const descriptionsKeys = [
    'databases.description1',
    'databases.description2',
    'databases.description3',
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
        <h1>{t('databases.title')}</h1>
        <h4>{t('databases.subtitle')}</h4>

        <img
          src={onboardingImgSrc}
          className="max-h-[250px]"
          alt="managed database service"
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

      <Button data-testid="create-database-service-link" size="lg" asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {t('databases.createServiceButton')}
        </Link>
      </Button>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
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
                  onClick={() =>
                    track(TRACKING.onboarding.createDatabaseClick())
                  }
                  to={`../new?STEP_1=${freeTier.engine}&STEP_2=${freeTier.plan}&STEP_3=${freeTier.region}`}
                  className="hover:no-underline hover:text-primary-foreground"
                >
                  {t('databases.tile.freeTier.cta')}
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingDatabases;
