import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Loading from '@/pages/loading';

const Informations = lazy(() => import('./informations'));
const Subscriptions = lazy(() => import('./suscriptions'));
const Configurations = lazy(() => import('./configurations'));

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div className="container">
      <div>
        <div className="row">
          <div className="col-4">
            <div className="tabsDashboard">
              <span>
                <osds-text
                  color="text"
                  size="400"
                  level="heading"
                  hue="500"
                  class="hydrated"
                >
                  {t('nasha_dashboard_information_title')}
                </osds-text>
                <osds-divider
                  color="default"
                  size="1"
                  class="hydrated"
                  separator=""
                ></osds-divider>
                <Suspense fallback={<Loading />}>
                  <Informations serviceName={serviceName} />
                </Suspense>
              </span>
            </div>
          </div>
          <div className="col-4">
            <div className="tabsDashboard">
              <span>
                <osds-text
                  color="text"
                  size="400"
                  level="heading"
                  hue="500"
                  class="hydrated"
                >
                  {t('nasha_dashboard_configuration_title')}
                </osds-text>
                <osds-divider
                  color="default"
                  size="1"
                  class="hydrated"
                  separator=""
                ></osds-divider>
                <Suspense fallback={<Loading />}>
                  <Configurations serviceName={serviceName} />
                </Suspense>
              </span>
            </div>
          </div>
          <div className="col-4">
            <div className="tabsDashboard">
              <span>
                <osds-text
                  color="text"
                  size="400"
                  level="heading"
                  hue="500"
                  class="hydrated"
                >
                  {t('nasha_dashboard_abonnement_title')}
                </osds-text>
                <osds-divider
                  color="default"
                  size="1"
                  class="hydrated"
                  separator=""
                ></osds-divider>
                <Suspense fallback={<Loading />}>
                  <Subscriptions serviceName={serviceName} />
                </Suspense>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
