import React, { Suspense, useMemo } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
} from '@ovhcloud/ods-components';
import { useObservabilityFeatures } from './hooks/useObservabilityFeatures';
import { ObsFeatureType } from './types';
import {
  ObsFeatureSwitcher,
  ObsSpinner,
  ObsToolbarActions,
} from './components';

interface IObservabilityModule {
  enabledFeatures: ObsFeatureType[];
  defaultActiveFeature?: ObsFeatureType;
}

export function ObservabilityModule({
  enabledFeatures,
  defaultActiveFeature,
}: Readonly<IObservabilityModule>) {
  const { productId } = useParams();

  const {
    currentObsFeature,
    hasValidFeature,
    shouldShowFeatureSwitcher,
    featureSwitcherItems,
  } = useObservabilityFeatures(
    enabledFeatures,
    defaultActiveFeature,
    productId,
  );

  const ObservabilityContextValues = useMemo(
    () => ({
      currentObsFeature,
    }),
    [currentObsFeature],
  );

  if (!hasValidFeature) {
    return (
      <OdsMessage className="m-4" color={ODS_MESSAGE_COLOR.warning}>
        <span>No active feature found. Please check your configuration</span>
      </OdsMessage>
    );
  }

  const toolbarActions = [
    {
      id: 'explore-grafana',
      label: 'Explore in Grafana®',
      link: 'https://yjaaouane.grafana.net/',
      variant: ODS_BUTTON_VARIANT.outline,
      isExternal: true,
    },
    {
      id: 'analyse-obs',
      label: 'Analyse in Observability',
      link: '',
    },
    {
      id: 'manage-obs-config',
      label: 'Manage your configuration',
      link: '',
      isExternal: true,
    },
  ];

  return (
    <>
      <div
        className={`flex ${
          shouldShowFeatureSwitcher ? 'justify-between' : 'justify-end'
        }`}
      >
        {shouldShowFeatureSwitcher && (
          <ObsFeatureSwitcher
            items={featureSwitcherItems}
            activeItemId={currentObsFeature!}
          />
        )}
        <ObsToolbarActions items={toolbarActions} />
      </div>

      <Suspense
        fallback={
          <ObsSpinner
            message="Loading observability module..."
            details={`Loading ${currentObsFeature}...`}
          />
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
}
