import React from 'react';
import { RirSelectionSection } from './sections/RirSelectionSection.component';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { ByoipContext } from './Byoip.context';

export const ByoipOrder: React.FC = () => {
  const { ipRir, selectedRegion } = React.useContext(ByoipContext);

  const visibleSections = {
    ipRirSelection: ipRir,
    regionSelection: selectedRegion,
  };

  return (
    <>
      {<RirSelectionSection />}
      {visibleSections.ipRirSelection && <RegionSelectionSection />}
      {/* { <IpRangeSelectionSection />}
        { <AsSelectionSection />}
        {<OrderButtonSection />}  */}
    </>
  );
};
