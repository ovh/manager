import { ObservabilityModule } from '@ovh-ux/observability';
import { ObsFeatureType } from '@ovh-ux/observability/src/types';

interface DashboardDetailsPageProps {
  enabledFeatures: ObsFeatureType[];
  defaultActiveFeature?: ObsFeatureType;
}

const DashboardDetailsPage = ({
  enabledFeatures,
  defaultActiveFeature,
}: Readonly<DashboardDetailsPageProps>) => {
  return (
    <div className="flex flex-col gap-4">
      <ObservabilityModule
        enabledFeatures={enabledFeatures}
        defaultActiveFeature={defaultActiveFeature}
      />
    </div>
  );
};

export default DashboardDetailsPage;
