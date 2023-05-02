import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import Partitions from './partitions';
import Loading from '@/pages/loading';

const Informations = lazy(() => import('./informations'));
const Subscriptions = lazy(() => import('./suscriptions'));
const Configurations = lazy(() => import('./configurations'));

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div>
      <Heading as="h3" size="sm">
        {' '}
        {t('title')}
      </Heading>
      <div className="panelInfos">
        <ul>
          <li className="panelInfos">
            <div class="tile-container">
              <osds-tile
                tabindex="-1"
                color="default"
                rounded=""
                size="md"
                variant="hollow"
                class="hydrated"
              >
                <span>
                  <osds-text
                    color="text"
                    size="400"
                    level="heading"
                    hue="500"
                    class="hydrated"
                  >
                    Informations
                  </osds-text>
                  <osds-divider
                    color="default"
                    size="6"
                    class="hydrated"
                    separator=""
                  ></osds-divider>
                  <Suspense fallback={<Loading />}>
                    <Informations serviceName={serviceName} />
                  </Suspense>
                </span>
              </osds-tile>
            </div>
          </li>
          <li className="panelInfos">
            <div className="tile-container">
              <osds-tile
                tabindex="-1"
                color="default"
                rounded=""
                size="md"
                variant="hollow"
                class="hydrated"
              >
                <span>
                  <osds-text
                    color="text"
                    size="400"
                    level="heading"
                    hue="500"
                    class="hydrated"
                  >
                    Configuration
                  </osds-text>
                  <osds-divider
                    color="default"
                    size="6"
                    class="hydrated"
                    separator=""
                  ></osds-divider>
                  <Suspense fallback={<Loading />}>
                    <Configurations serviceName={serviceName} />
                  </Suspense>
                </span>
              </osds-tile>
            </div>
          </li>
          <li className="panelInfos">
            <div class="tile-container">
              <osds-tile
                tabindex="-1"
                color="default"
                rounded=""
                size="md"
                flex=""
                variant="hollow"
                class="hydrated"
              >
                <span>
                  <osds-text
                    color="text"
                    size="400"
                    level="heading"
                    hue="500"
                    class="hydrated"
                  >
                    Abonnement
                  </osds-text>
                  <osds-divider
                    color="default"
                    size="6"
                    class="hydrated"
                    separator=""
                  ></osds-divider>
                  <Suspense fallback={<Loading />}>
                    <Subscriptions serviceName={serviceName} />
                  </Suspense>
                </span>
              </osds-tile>
            </div>
          </li>
        </ul>
        <osds-text
          color="text"
          size="400"
          level="heading"
          hue="500"
          class="hydrated"
        >
          Partitions
        </osds-text>
        <Partitions serviceName={serviceName} />
      </div>
    </div>
  );
}
