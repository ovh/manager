import React from 'react';
import { ByoipContext } from './Byoip.context';
import { RirSelectionSection } from './sections/RirSelectionSection.component';
import { RegionSelectionSection } from './sections/RegionSelectionSection.component';
import { TokenSelectionSection } from './sections/TokenSection.component';
import { IpRangeSelectionSection } from './sections/IpRangeSelectionSection.component';
import { useGetTokens } from '@/data/hooks/useGetTokens';

export const ByoipOrder: React.FC = () => {
  const { ipRir, selectedRegion } = React.useContext(ByoipContext);

  const { token } = useGetTokens({
    campus: selectedRegion,
  });

  const visibleSections = {
    regionSelection: ipRir,
    tokenSelection: selectedRegion,
    ipRangeSelection: token,
    // asSelection: ipRange,
  };

  return (
    <>
      <RirSelectionSection />
      {visibleSections.regionSelection && <RegionSelectionSection />}
      {visibleSections.tokenSelection && <TokenSelectionSection />}
      {visibleSections.ipRangeSelection && <IpRangeSelectionSection />}
      {/* {visibleSections.ipRangeSelection && <AsSelectionSection />} */}
      {/* { <IpRangeSelectionSection />}
        { <AsSelectionSection />}
        {<OrderButtonSection />}  */}
    </>
  );
};
