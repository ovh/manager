import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import {
  DEFAULT_BANDWIDTH_PLAN_CODE,
  useGetPublicRoutingBandwidthLimits,
  useVrackBandwidthCartOptions,
} from '@ovh-ux/manager-network-common';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { BandwidthOptionCard } from '@/components/BandwidthOptionCard/BandwidthOptionCard';
import { OrderContext } from '../order.context';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';

export const VrackBandwidthSection: React.FC = () => {
  const {
    selectedService,
    selectedRegion,
    selectedVrackBandwidthPlanCode,
    setSelectedVrackBandwidthPlanCode,
  } = React.useContext(OrderContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.order,
    TRANSLATION_NAMESPACES.ips,
  ]);
  const [selectedBandwidth, setSelectedBandwidth] = React.useState<number>();
  const { trackClick } = useOvhTracking();

  const {
    bandwidthLimits,
    isError: isBandwidthLimitError,
    isLoading: isBandwidthLimitLoading,
    error: bandwidthLimitError,
  } = useGetPublicRoutingBandwidthLimits({
    serviceName: selectedService,
    region: selectedRegion,
  });

  const {
    isLoading: isBandwidthCartOptionsLoading,
    isError: isBandwidthCartOptionsError,
    error: bandwidthCartOptionsError,
    vrackCartBandwidthOptionListByRegion,
  } = useVrackBandwidthCartOptions({
    serviceName: selectedService,
    regions: [selectedRegion],
  });

  useEffect(() => {
    setSelectedBandwidth(bandwidthLimits?.[0]?.bandwidthLimit);
  }, [bandwidthLimits?.[0]?.bandwidthLimit]);

  return (
    <OrderSection
      title={t('vrack_bandwidth_section_title')}
      description={t('vrack_bandwidth_section_description_1')}
      description2={t('vrack_bandwidth_section_description_2')}
      description3={t('vrack_bandwidth_section_description_3')}
      className="flex flex-col"
      isLoading={isBandwidthLimitLoading || isBandwidthCartOptionsLoading}
      isError={isBandwidthLimitError || isBandwidthCartOptionsError}
      errorComponent={
        <ApiErrorMessage
          error={bandwidthLimitError || bandwidthCartOptionsError}
        />
      }
    >
      <div className="flex flex-col gap-4">
        {vrackCartBandwidthOptionListByRegion?.[selectedRegion]?.map(
          (option) => (
            <BandwidthOptionCard
              key={option.planCode}
              isSelected={option.bandwidthLimit === selectedBandwidth}
              tooltip={
                option.bandwidthLimit > bandwidthLimits?.[0]?.bandwidthLimit
                  ? t('bandwidth_option_card_tooltip')
                  : undefined
              }
              message={
                option.bandwidthLimit === bandwidthLimits?.[0]?.bandwidthLimit
                  ? t('current_bandwidth', { ns: TRANSLATION_NAMESPACES.ips })
                  : undefined
              }
              onClick={() => {
                setSelectedBandwidth(option.bandwidthLimit);

                setSelectedVrackBandwidthPlanCode(
                  option.bandwidthLimit === bandwidthLimits?.[0]?.bandwidthLimit
                    ? undefined
                    : option.planCode,
                );

                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.funnel,
                  actions: [
                    'select_vrack_public_bandwidth',
                    option.bandwidthLimit.toString(),
                  ],
                });
              }}
              bandwidthLimit={option.bandwidthLimit}
              price={option.priceInUcents}
            />
          ),
        )}
      </div>
      {bandwidthLimits?.[0]?.bandwidthLimitType !== 'default' &&
        bandwidthLimits?.[0]?.bandwidthLimit !== selectedBandwidth &&
        selectedVrackBandwidthPlanCode !== DEFAULT_BANDWIDTH_PLAN_CODE && (
          <OdsMessage
            className="mt-6"
            color={ODS_MESSAGE_COLOR.information}
            isDismissible={false}
          >
            {t('vrack_bandwidth_double_order_info_message')}
          </OdsMessage>
        )}
    </OrderSection>
  );
};
