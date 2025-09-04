import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage, OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useAdditionalIpsRegions } from '@/data/hooks/catalog';
import { useIpv6Availability } from '@/data/hooks/useIpv6Availability';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';
import { OrderContext } from '../order.context';

export const RegionSelectionSection: React.FC = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedServiceType,
    selectedService,
    ipVersion,
  } = React.useContext(OrderContext);
  const { t } = useTranslation('order');
  const { regionList, isLoading, isError, error } = useAdditionalIpsRegions({
    serviceType: selectedServiceType,
  });
  const {
    hasReachedIpv6Limit,
    disabledRegionList,
    isLoading: isRegionAvailabilityLoading,
    isError: isRegionAvailabilityError,
    error: regionAvailabilityError,
  } = useIpv6Availability({
    ipVersion,
    serviceName: selectedService,
    serviceType: selectedServiceType,
  });

  if (hasReachedIpv6Limit) {
    return (
      <OrderSection title={t('region_selection_title')}>
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('ipv6_limit_reached_error')}
        </OdsMessage>
      </OrderSection>
    );
  }

  return (
    <OrderSection
      isLoading={isLoading || isRegionAvailabilityLoading}
      title={t('region_selection_title')}
    >
      {isError || isRegionAvailabilityError ? (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('error_message', { error: error || regionAvailabilityError })}
        </OdsMessage>
      ) : (
        <React.Suspense fallback={<OdsSpinner />}>
          <RegionSelector
            regionList={regionList}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            disabledRegions={disabledRegionList?.map(
              ({ region, has3blocks }) => ({
                region,
                message: has3blocks
                  ? t('ipv6_region_3_blocks_limit_reached_error')
                  : t('ipv6_region_already_used_error'),
              }),
            )}
          />
        </React.Suspense>
      )}
    </OrderSection>
  );
};
