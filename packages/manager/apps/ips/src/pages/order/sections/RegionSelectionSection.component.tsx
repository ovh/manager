import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  Message,
  Spinner,
} from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { RegionSelector } from '@/components/RegionSelector/region-selector.component';
import { useAdditionalIpsRegions } from '@/data/hooks/catalog';
import { useIpv6Availability } from '@/data/hooks/useIpv6Availability';

import { OrderContext } from '../order.context';

export const RegionSelectionSection: React.FC = () => {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedServiceType,
    selectedService,
    ipVersion,
    setSelectedOrganisation,
  } = React.useContext(OrderContext);
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('order');
  const { regionList, isLoading, isError, error } = useAdditionalIpsRegions({
    ipVersion,
    serviceType: selectedServiceType,
  });
  const {
    hasReachedIpv6Limit,
    disabledRegionList,
    loading: isRegionAvailabilityLoading,
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
        <Message color={MESSAGE_COLOR.critical}>
          <MessageBody>{t('ipv6_limit_reached_error')}</MessageBody>
        </Message>
      </OrderSection>
    );
  }

  const handleSelectRegion = (updatedRegion?: string) => {
    setSelectedRegion(updatedRegion);
    setSelectedOrganisation(undefined);
    trackClick({
      actionType: 'action',
      buttonType: ButtonType.button,
      location: PageLocation.funnel,
      actions: [`select_${updatedRegion}`],
    });
  };

  return (
    <OrderSection
      loading={isLoading || isRegionAvailabilityLoading}
      title={t('region_selection_title')}
    >
      {isError || isRegionAvailabilityError ? (
        <Message color={MESSAGE_COLOR.critical}>
          <MessageBody>
            {t('error_message', { error: error || regionAvailabilityError })}
          </MessageBody>
        </Message>
      ) : (
        <React.Suspense fallback={<Spinner />}>
          <RegionSelector
            regionList={regionList}
            selectedRegion={selectedRegion}
            setSelectedRegion={handleSelectRegion}
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
