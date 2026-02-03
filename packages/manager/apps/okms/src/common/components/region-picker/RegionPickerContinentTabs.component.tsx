import { useRegionName } from '@key-management-service/hooks/useRegionName';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

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
    <Tabs
      value={activeContinent}
      onValueChange={(event) => setActiveContinent(event.value as ContinentCode)}
    >
      <TabList>
        {continents.map((continent) => (
          <Tab
            key={continent}
            data-testid={continent}
            value={continent}
            onClick={() => setActiveContinent(continent)}
          >
            {translateGeographyName(continent)}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};
