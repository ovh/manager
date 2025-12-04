import { useRegionName } from '@key-management-service/hooks/useRegionName';

import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';

import { ContinentCode } from '@/common/utils/location/continents';

type RegionPickerContinentTabsProps = {
  continents: ContinentCode[];
  activeContinent: ContinentCode;
  setActiveContinent: (continent: ContinentCode) => void;
};

export const RegionPickerContinentTabs = ({
  continents,
  activeContinent,
  setActiveContinent,
}: RegionPickerContinentTabsProps) => {
  const { translateGeographyName } = useRegionName();
  return (
    <OdsTabs>
      {continents.map((continent) => (
        <OdsTab
          key={continent}
          id={continent}
          data-testid={continent}
          role="tab"
          isSelected={activeContinent === continent}
          onClick={() => setActiveContinent(continent)}
        >
          {translateGeographyName(continent)}
        </OdsTab>
      ))}
    </OdsTabs>
  );
};
