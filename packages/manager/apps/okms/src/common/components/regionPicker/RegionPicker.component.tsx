import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { useLocations } from '@secret-manager/data/hooks/useLocation';
import { useRegionName } from '@/hooks/useRegionName';
import { RadioCard } from '../RadioCard/RadioCard.component';
import { RegionTypeBadge } from '@/components/regionTypeBadge/RegionTypeBadge.component';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';
import { useNotificationAddErrorOnce } from '@/hooks/useNotificationAddErrorOnce';

type RegionPickerProps = {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
};

export const RegionPicker = ({
  selectedRegion,
  setSelectedRegion,
}: RegionPickerProps) => {
  const { translateRegionName } = useRegionName();
  const {
    data: locations,
    isPending: isPendingLocations,
    error: errorLocations,
  } = useLocations();

  const {
    data: catalogOkms,
    isPending: isPendingCatalogOkms,
    error: errorCatalogOkms,
  } = useOrderCatalogOkms();

  const error = errorCatalogOkms || errorLocations;
  useNotificationAddErrorOnce(error);

  if (error) {
    return null;
  }

  const isPending = isPendingLocations || isPendingCatalogOkms;
  if (isPending) {
    return (
      <div>
        <OdsSpinner size="md" />
      </div>
    );
  }

  const regions = catalogOkms?.plans[0]?.configurations[0]?.values;
  const filteredLocations = locations?.filter((location) =>
    regions?.includes(location.name),
  );

  return (
    <div className="space-y-3">
      {filteredLocations?.map((location) => (
        <RadioCard
          id={location.name}
          onChange={(event) => setSelectedRegion(event.target.value)}
          selected={selectedRegion}
          key={location.name}
          name="region"
          title={translateRegionName(location.name)}
          subTitle={location.name}
          badges={<RegionTypeBadge type={location.type} />}
        />
      ))}
    </div>
  );
};
