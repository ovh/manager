import { useTranslation } from 'react-i18next';
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
        <h1>Transformez vos données en informations exploitables et non en sources de problèmes.</h1>
        <h4>Grâce à nos moteurs d'analyse entièrement gérés, libérez-vous des contraintes administratives et concentrez-vous sur vos applications et vos produits.</h4>
        <img
          src={onboardingImgSrc}
          className="max-h-[250px]"
          alt="managed database service"
        />
        <p>
          Analysez, recherchez et surveillez vos données à grande échelle, sans gérer d'infrastructure complexe.
        </p>
        <p>
          Déployez <b>Kafka, ClickHouse, OpenSearch et Grafana</b> en quelques minutes pour optimiser vos flux de données, vos analyses et vos charges de travail d'observabilité. Tous les services sont entièrement gérés, résilients multi-AZ et s'intègrent parfaitement à vos bases de données et applications cloud.
        </p>
        <p>
          Des tableaux de bord aux pipelines de données, <b>gagnez en visibilité et en performance</b> tout en conservant un <b>contrôle total et la souveraineté de vos données.</b>
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
          title={"Quick Start"}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/"
          linkName={t('cardLink')}
        >
          <p>Apprenez à déployer rapidement vos pipelines et dashboards managés.</p>
        </OnboardingTile>
        <OnboardingTile
          title={"Documentation et tutorial"}
          href="https://docs.ovh.com/gb/en/publiccloud/databases/getting-started"
          linkName={t('cardLink')}
        >
          <p>Retrouvez tous les guides et tutoriels de nos moteurs Analytics managés</p>
        </OnboardingTile>
        <OnboardingTile
          title={"Intégrations"}
          href="https://help.ovhcloud.com/csm/en-gb-public-cloud-databases-mongodb-getting-started?id=kb_article_view&sysparm_article=KB0061254"
          linkName={t('cardLink')}
        >
          <p>Connectez-vous facilement avec vos bases de données, Object Storage, ou clusters Kubernetes.</p>
        </OnboardingTile>
      </div>
    </div>);
}
 
export default OnboardingAnalytics;