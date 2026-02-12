import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ComboboxContent,
  ComboboxControl,
  FormFieldLabel,
  MESSAGE_COLOR,
  MessageBody,
  Combobox,
  FormField,
  Message,
} from '@ovhcloud/ods-react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import {
  ServiceInfo,
  ServiceInfoWithId,
  useCheckServiceAvailability,
  useGetProductServices,
} from '@/data/hooks';
import { ServiceRegion } from '@/pages/order/ServiceRegion.component';
import { IpVersion, ServiceType, ipParkingOptionValue } from '@/types';

import { OrderContext } from '../order.context';
import { TRANSLATION_NAMESPACES } from '@/utils';

const getServiceType = (
  serviceId: string,
  servicesByCategory: Record<string, ServiceInfo[]>,
): ServiceType => {
  if (serviceId === ipParkingOptionValue) {
    return ServiceType.ipParking;
  }
  if (
    servicesByCategory[IpTypeEnum.PCC]?.some(
      ({ serviceName }) => serviceName === serviceId,
    )
  ) {
    return ServiceType.dedicatedCloud;
  }
  if (
    servicesByCategory[IpTypeEnum.DEDICATED]?.some(
      ({ serviceName }) => serviceName === serviceId,
    )
  ) {
    return ServiceType.server;
  }
  if (
    servicesByCategory[IpTypeEnum.VPS]?.some(
      ({ serviceName }) => serviceName === serviceId,
    )
  ) {
    return ServiceType.vps;
  }
  return servicesByCategory[IpTypeEnum.VRACK]?.some(
    ({ serviceName }) => serviceName === serviceId,
  )
    ? ServiceType.vrack
    : ServiceType.unknown;
};

export const ServiceSelectionSection: React.FC = () => {
  const {
    ipVersion,
    selectedService,
    setSelectedService,
    selectedServiceType,
    setSelectedServiceType,
    disabledServices,
    addDisabledService,
  } = React.useContext(OrderContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.order);
  const { trackClick } = useOvhTracking();

  const { serviceByCategory, loading, isError, error } = useGetProductServices([
    PRODUCT_PATHS_AND_CATEGORIES[IpTypeEnum.VRACK],
    PRODUCT_PATHS_AND_CATEGORIES[IpTypeEnum.DEDICATED],
    PRODUCT_PATHS_AND_CATEGORIES[IpTypeEnum.VPS],
    PRODUCT_PATHS_AND_CATEGORIES[IpTypeEnum.PCC],
  ]);

  const {
    [IpTypeEnum.DEDICATED]: server,
    [IpTypeEnum.VRACK]: vrack,
    [IpTypeEnum.VPS]: vps,
    [IpTypeEnum.PCC]: dedicatedCloud,
  } = serviceByCategory;

  const {
    isServiceInfoLoading,
    hasServiceInfoError,
    serviceStatus,
  } = useCheckServiceAvailability({
    serviceName: selectedService,
    serviceType: selectedServiceType,
    onServiceUnavailable: addDisabledService,
  });

  const toComboboxOption = (service: ServiceInfoWithId) => ({
    label:
      service.displayName && service.displayName !== service.serviceName
        ? `${service.displayName} (${service.serviceName})`
        : service.serviceName,
    value: service.serviceName,
    disabled: disabledServices.includes(service.serviceName),
  });

  return (
    <OrderSection title={t('service_selection_title')}>
      {isError && (
        <Message color={MESSAGE_COLOR.critical}>
          <MessageBody>{t('error_message', { error })}</MessageBody>
        </Message>
      )}
      <FormField className="w-full">
        <FormFieldLabel>{t('service_selection_select_label')}</FormFieldLabel>
        <Combobox
          id="service"
          name="service"
          className="w-full max-w-[384px]"
          highlightResults
          customOptionRenderer={ComboboxServiceItem}
          onValueChange={(event) => {
            const serviceId = event.value?.[0];
            if (!disabledServices.includes(serviceId)) {
              setSelectedService(serviceId);
              setSelectedServiceType(
                getServiceType(serviceId, serviceByCategory),
              );
            } else {
              setSelectedService(undefined);
              setSelectedServiceType(undefined);
            }
            if (serviceId) {
              trackClick({
                buttonType: ButtonType.button,
                location: PageLocation.funnel,
                actionType: 'action',
                actions: [`select_${serviceId}`],
              });
            }
          }}
          allowCustomValue={false}
          invalid={isError}
          value={[selectedService]}
          items={[
            ipVersion === IpVersion.ipv4 && {
              label: t(
                'service_selection_select_dedicated_cloud_option_group_label',
              ),
              options: dedicatedCloud?.map(toComboboxOption),
            },
            ipVersion === IpVersion.ipv4 && {
              label: t(
                'service_selection_select_dedicated_server_option_group_label',
              ),
              options: server?.map(toComboboxOption),
            },
            ipVersion === IpVersion.ipv4 && {
              label: t('service_selection_select_vps_option_group_label'),
              options: vps?.map(toComboboxOption),
            },
            ipVersion === IpVersion.ipv4 && {
              label: t(
                'service_selection_select_ip_parking_option_group_label',
              ),
              options: [
                {
                  label: t('service_selection_select_ip_parking_option_label'),
                  value: ipParkingOptionValue,
                },
              ],
            },
            {
              label: t('service_selection_select_vrack_option_group_label'),
              options: vrack?.map(toComboboxOption),
            },
          ].filter(Boolean)}
        >
          <ComboboxControl
            clearable
            placeholder={t('service_selection_select_placeholder')}
            loading={loading}
          />
          <ComboboxContent />
        </Combobox>
        {!!selectedService && (
          <div slot="helper">
            <div className="mt-1">
              {!isServiceInfoLoading &&
                (serviceStatus !== 'ok' || hasServiceInfoError) && (
                  <Message
                    className="block max-w-[384px]"
                    color={MESSAGE_COLOR.critical}
                    dismissible={false}
                  >
                    <MessageBody>
                      {t(
                        `service_selection_${serviceStatus ||
                          'expired'}_error_message`,
                      )}
                    </MessageBody>
                  </Message>
                )}
              <ServiceRegion />
            </div>
          </div>
        )}
      </FormField>
    </OrderSection>
  );
};
