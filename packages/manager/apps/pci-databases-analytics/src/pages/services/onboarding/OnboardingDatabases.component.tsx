import { useTranslation } from 'react-i18next';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@datatr-ux/uxlib';
import onboardingImgSrc from '@/../public/assets/onboarding-databases.png';
import Guides from '@/components/guides/Guides.component';
import { GuideSections } from '@/types/guide';
import Link from '@/components/links/Link.component';
import { useTrackAction } from '@/hooks/useTracking';
import { TRACKING } from '@/configuration/tracking.constants';
import OnboardingTile from './OnboardingTile.component';
import { useGetAvailabilities } from "@/hooks/api/database/availability/useGetAvailabilities.hook";
import { useParams } from "react-router-dom";
import { PlanCode } from "@/types/cloud/Project";
import { EngineEnum } from "@/types/cloud/project/database";
import A from "@/components/links/A.component";
import { ExternalLink } from "lucide-react";

const OnboardingDatabases = () => {
  const { t } = useTranslation('pci-databases-analytics/services/onboarding');
  const track = useTrackAction();
  const { projectId } = useParams();
  const { data } = useGetAvailabilities(projectId);

  const freeTier = data?.find((avail) => avail.engine === EngineEnum.mongodb && avail.plan === "discovery");
  return (<div
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
      <div className="flex flex-col items-center text-center gap-4 max-w-8xl">
        <h1>
          <b>Développez plutôt vos bases de données, au lieu de vous en soucier.</b>
        </h1>

        <h4>
          Avec nos bases de données entièrement gérées, libérez-vous des contraintes administratives et concentrez-vous sur vos applications et vos produits.
        </h4>

        <img
          src={onboardingImgSrc}
          className="max-h-[250px]"
          alt="managed database service"
        />

        <p>
          SQL, NoSQL ou mise en cache : nous avons la solution. Déployez votre moteur
          de base de données préféré en quelques minutes grâce à notre gamme de
          solutions gérées : <b>PostgreSQL, MySQL, MongoDB et Valkey</b>.
        </p>

        <p>
          Nos équipes gèrent l’infrastructure, les sauvegardes et la surveillance
          pour que vous puissiez vous concentrer sur le développement
          d’applications performantes, et non sur la maintenance des serveurs.
        </p>

        <p>
          De plus, commencez petit et évoluez facilement au fur et à mesure que vos
          données augmentent, le tout avec une <b>tarification prévisible</b>, la
          <b> souveraineté des données</b> et une <b>haute disponibilité</b> intégrée.
        </p>
      </div>
      <Button data-testid="create-service-link" asChild>
        <Link
          onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
          to="../new"
          className="hover:no-underline hover:text-primary-foreground"
        >
          {/* {t('createServiceButton')} */}
          Démarrez
        </Link>
      </Button>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-2">
        <OnboardingTile
          title={"Documentation & Tutorials"}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
          linkName={t('cardLink')}
        >
          <p>Apprenez à déployer rapidement votre première base de données managée.</p>
        </OnboardingTile>
        <OnboardingTile
          title={"Quick Start"}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/"
          linkName={t('cardLink')}
        >
          <p>Retrouvez tous les guides et tutoriels de nos bases de données managées</p>
        </OnboardingTile>
        <Card className="flex flex-col justify-between">
          <CardHeader className="py-4">
            <CardTitle>
              MongoDB Free Tier
              
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p>Bénéficiez d'un premier cluster MongoDB managé gratuit à vie.</p>
            <A href={"https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"} target="_blank" rel="noopener noreferrer">
              <div className="inline-flex items-center gap-2">
                <span>{t('cardLink')}</span>
                <ExternalLink className="size-4" />
              </div>
            </A>
          </CardContent>
          <CardFooter>
            {freeTier && (
                <Button data-testid="create-service-link" asChild>
                  <Link
                    onClick={() => track(TRACKING.onboarding.createDatabaseClick())}
                    to={`../new?STEP_1=${freeTier.engine}&STEP_2=${freeTier.plan}&STEP_3=${freeTier.region}`}
                    className="hover:no-underline hover:text-primary-foreground"
                  >
                    Lancez votre instance MongoDB en deux clicks
                  </Link>
                </Button>
              )}
          </CardFooter>
        </Card>
      </div>
    </div>);
}
 
export default OnboardingDatabases;