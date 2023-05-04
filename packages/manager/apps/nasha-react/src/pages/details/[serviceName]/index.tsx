/* eslint-disable @typescript-eslint/naming-convention */
import React, { ComponentProps, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loading from '../../loading';

const Informations = lazy(() => import('./informations'));
const Subscriptions = lazy(() => import('./suscriptions'));
const Configurations = lazy(() => import('./configurations'));

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  interface SectionProps {
    title: string;
    component: React.ComponentType<ComponentProps & { serviceName: string }>;
  }
  const Section = ({ title, component: Component }: SectionProps) => (
    <div className="col">
      <span className="element">
        <osds-text
          color="default"
          size="400"
          level="heading"
          hue="500"
          class="hydrated"
        >
          {t(title)}
        </osds-text>
        <div className="element">
          <osds-divider
            color="default"
            size="1"
            class="hydrated"
            separator=""
          ></osds-divider>
        </div>
        <Suspense fallback={<Loading />}>
          <Component serviceName={serviceName} />
        </Suspense>
      </span>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <Section
          title="nasha_dashboard_information_title"
          component={Informations}
        />
        <Section
          title="nasha_dashboard_configuration_title"
          component={Configurations}
        />
        <Section
          title="nasha_dashboard_abonnement_title"
          component={Subscriptions}
        />
      </div>
    </div>
  );
}
