import { useMemo, useState } from 'react';

import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { useRegionName } from '@key-management-service/hooks/useRegionName';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { RegionCertificationBadges } from '@/common/components/region-certification-badge/RegionCertificationBadges.component';
import { RegionTypeBadge } from '@/common/components/region-type-badge/RegionTypeBadge.component';
import { useLocations } from '@/common/data/hooks/useLocation';
import { useOrderCatalogOkms } from '@/common/data/hooks/useOrderCatalogOkms';
import { useReferenceRegions } from '@/common/data/hooks/useReferenceRegions';
import { Location } from '@/common/types/location.type';
import { ReferenceRegion } from '@/common/types/referenceRegions.type';
import { ContinentCode } from '@/common/utils/location/continents';
import { groupLocationsByContinent } from '@/common/utils/location/continents';

import { RadioCard } from '../radio-card/RadioCard.component';
import { RegionPickerContinentTabs } from './RegionPickerContinentTabs.component';
import { REGION_PICKER_TEST_IDS } from './regionPicker.constants';

type RegionPickerProps = {
  selectedRegion: string | undefined;
  setSelectedRegion: (region: string | undefined) => void;
};

export const RegionPicker = ({ selectedRegion, setSelectedRegion }: RegionPickerProps) => {
  const { data: locations, isPending: isPendingLocations, error: errorLocations } = useLocations();

  const {
    data: catalogOkms,
    isPending: isPendingCatalogOkms,
    error: errorCatalogOkms,
  } = useOrderCatalogOkms();

  const {
    data: referenceRegions,
    isPending: isPendingReferenceRegions,
    error: errorReferenceRegions,
  } = useReferenceRegions();

  const error = errorCatalogOkms || errorLocations || errorReferenceRegions;
  useNotificationAddErrorOnce(error);

  if (error) {
    return null;
  }

  const isPending = isPendingLocations || isPendingCatalogOkms || isPendingReferenceRegions;
  if (isPending) {
    return (
      <div>
        <OdsSpinner size="md" data-testid={REGION_PICKER_TEST_IDS.SPINNER} />
      </div>
    );
  }

  // Get the regions available in the catalog
  const regions = catalogOkms?.plans[0]?.configurations[0]?.values;

  // Filter the locations corresponding to the available regions
  const filteredLocations = locations?.filter((location) => regions?.includes(location.name));

  return (
    <RegionPickerContent
      selectedRegion={selectedRegion}
      setSelectedRegion={setSelectedRegion}
      locations={filteredLocations}
      referenceRegions={referenceRegions}
    />
  );
};

type RegionPickerContentProps = RegionPickerProps & {
  locations: Location[];
  referenceRegions: ReferenceRegion[];
};

const RegionPickerContent = ({
  selectedRegion,
  setSelectedRegion,
  locations,
  referenceRegions,
}: RegionPickerContentProps) => {
  const { translateRegionName } = useRegionName();

  // Group the locations by continent to display the continents tabs
  const { locationsByContinent, continents } = useMemo(
    () => groupLocationsByContinent(locations),
    [locations],
  );

  // Create a mapping from region id to certifications
  const regionCertificationsMap = useMemo(
    () => new Map(referenceRegions?.map((region) => [region.id, region.certifications])),
    [referenceRegions],
  );

  const [activeContinent, setActiveContinent] = useState<ContinentCode>(continents[0] ?? 'EUROPE');

  return (
    <div className="space-y-3">
      <RegionPickerContinentTabs
        continents={continents}
        activeContinent={activeContinent}
        setActiveContinent={setActiveContinent}
      />
      {locationsByContinent[activeContinent]?.map((location) => (
        <RadioCard
          id={location.name}
          onChange={(event) => setSelectedRegion(event.target.value)}
          selected={selectedRegion}
          key={location.name}
          name="region"
          title={translateRegionName(location.name)}
          subTitle={location.name}
          badges={
            <div className="flex items-center gap-2">
              <RegionTypeBadge type={location.type} />
              <RegionCertificationBadges
                certifications={regionCertificationsMap.get(location.name) ?? []}
              />
            </div>
          }
        />
      ))}
    </div>
  );
};
