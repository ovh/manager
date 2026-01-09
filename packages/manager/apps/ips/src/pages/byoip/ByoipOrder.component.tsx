import React from 'react';

import { useGetTokens } from '@/data/hooks/useGetTokens';

import { ByoipContext } from './Byoip.context';
import { isValidIpRange } from './Byoip.utils';
import {
  AsTypeSelectionSection,
  IpRangeSelectionSection,
  OrderButtonSection,
  RegionSelectionSection,
  RirSelectionSection,
  TokenSelectionSection,
} from './sections';

export const ByoipOrder: React.FC = () => {
  const {
    ipRir,
    selectedRegion,
    ipRange,
    asType,
    asOwnRirType,
    asOwnNumberType,
  } = React.useContext(ByoipContext);

  const { token } = useGetTokens({
    campus: selectedRegion,
  });

  const visibleSections = {
    regionSelection: ipRir,
    tokenSelection: selectedRegion,
    ipRangeSelection: token,
    asTypeSelection: ipRange && isValidIpRange(ipRange),
    asOwnTypeSelection: asType && asType === 'own',
    orderButtonSelection:
      ((asType && asType === 'ovh_cloud') ||
        (asOwnRirType && asOwnNumberType)) &&
      ipRange &&
      isValidIpRange(ipRange),
  };

  return (
    <>
      <RirSelectionSection />
      {visibleSections.regionSelection && <RegionSelectionSection />}
      {visibleSections.tokenSelection && <TokenSelectionSection />}
      {visibleSections.ipRangeSelection && <IpRangeSelectionSection />}
      {visibleSections.asTypeSelection && <AsTypeSelectionSection />}
      {visibleSections.orderButtonSelection && <OrderButtonSection />}
    </>
  );
};
