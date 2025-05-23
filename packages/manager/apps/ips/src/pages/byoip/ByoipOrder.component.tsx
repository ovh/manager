import React from 'react';
import { ByoipContext } from './Byoip.context';
import {
  RirSelectionSection,
  RegionSelectionSection,
  TokenSelectionSection,
  IpRangeSelectionSection,
  AsTypeSelectionSection,
  AsOwnTypeSelectionSection,
  OrderButtonSection,
} from './sections';
import { useGetTokens } from '@/data/hooks/useGetTokens';
import { isValidIpRange } from './Byoip.utils';

export const ByoipOrder: React.FC = () => {
  const {
    ipRir,
    selectedRegion,
    ipRange,
    asType,
    asOwnRirType,
    asOwnNumberType,
  } = React.useContext(ByoipContext);

  const { token } = selectedRegion
    ? useGetTokens({
        campus: selectedRegion,
      })
    : { token: null };

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
      {visibleSections.asOwnTypeSelection && <AsOwnTypeSelectionSection />}
      {visibleSections.orderButtonSelection && <OrderButtonSection />}
    </>
  );
};
