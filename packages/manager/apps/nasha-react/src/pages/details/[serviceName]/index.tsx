import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Section from './section';
import Loading from '../../loading';

import '../../index.scss';

const Informations = lazy(() => import('./informations'));
const Subscriptions = lazy(() => import('./suscriptions'));
const Configurations = lazy(() => import('./configurations'));

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <Suspense fallback={<Loading />}>
      <div className="dashboard-section">
        <div>
          <Section title={t('nasha_dashboard_information_title')}>
            <Informations serviceName={serviceName} />
          </Section>
        </div>
        <div>
          <Section title={t('nasha_dashboard_configuration_title')}>
            <div className="">
              <Configurations serviceName={serviceName} />
            </div>
          </Section>
        </div>
        <div>
          <Section title={t('manager_billing_subscription')}>
            <Subscriptions serviceName={serviceName} />
          </Section>
        </div>
      </div>
    </Suspense>
  );
}
