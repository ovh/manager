import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsCombobox,
  OdsComboboxGroup,
  OdsComboboxItem,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OrderSection } from '@/components/OrderSection/OrderSection.component';
import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';
import { OrderContext } from '../order.context';
import { ServiceRegion } from '@/pages/order/ServiceRegion.component';
import { IpVersion, ServiceType, ipParkingOptionValue } from '@/types';
import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import {
  ServiceInfo,
  useGetProductServices,
  useCheckServiceAvailability,
} from '@/data/hooks';

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
  const { t } = useTranslation('order');

  const {
    serviceByCategory,
    isLoading,
    isError,
    error,
  } = useGetProductServices([
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

  return (
    <OrderSection title={t('service_selection_title')}>
      {isError && (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('error_message', { error })}
        </OdsMessage>
      )}
      <OdsFormField className="w-full">
        <label htmlFor="service" slot="label">
          {t('service_selection_select_label')}
        </label>
        <OdsCombobox
          id="service"
          name="service"
          className="w-full max-w-[384px]"
          onOdsChange={(event) => {
            const serviceId = event.detail.value as string;
            setSelectedService(serviceId);
            setSelectedServiceType(
              getServiceType(serviceId, serviceByCategory),
            );
          }}
          isClearable
          allowNewElement={false}
          hasError={isError}
          isLoading={isLoading}
          placeholder={t('service_selection_select_placeholder')}
          value={selectedService}
        >
          {ipVersion === IpVersion.ipv4 && (
            <OdsComboboxGroup>
              <span slot="title">
                {t(
                  'service_selection_select_dedicated_cloud_option_group_label',
                )}
              </span>
              {dedicatedCloud?.map((props) => (
                <ComboboxServiceItem
                  key={props.id}
                  name={props.serviceName}
                  displayName={props.displayName}
                  {...props}
                  isDisabled={disabledServices.includes(props.serviceName)}
                />
              ))}
            </OdsComboboxGroup>
          )}
          {ipVersion === IpVersion.ipv4 && (
            <OdsComboboxGroup>
              <span slot="title">
                {t(
                  'service_selection_select_dedicated_server_option_group_label',
                )}
              </span>
              {server?.map((props) => (
                <ComboboxServiceItem
                  key={props.id}
                  name={props.serviceName}
                  displayName={props.displayName}
                  {...props}
                  isDisabled={disabledServices.includes(props.serviceName)}
                />
              ))}
            </OdsComboboxGroup>
          )}
          {ipVersion === IpVersion.ipv4 && (
            <OdsComboboxGroup>
              <span slot="title">
                {t('service_selection_select_vps_option_group_label')}
              </span>
              {vps?.map((props) => (
                <ComboboxServiceItem
                  key={props.id}
                  name={props.serviceName}
                  displayName={props.displayName}
                  {...props}
                  isDisabled={disabledServices.includes(props.serviceName)}
                />
              ))}
            </OdsComboboxGroup>
          )}
          {ipVersion === IpVersion.ipv4 && (
            <OdsComboboxGroup>
              <span slot="title">
                {t('service_selection_select_ip_parking_option_group_label')}
              </span>
              <OdsComboboxItem value={ipParkingOptionValue}>
                {t('service_selection_select_ip_parking_option_label')}
              </OdsComboboxItem>
            </OdsComboboxGroup>
          )}
          <OdsComboboxGroup>
            <span slot="title">
              {t('service_selection_select_vrack_option_group_label')}
            </span>
            {vrack?.map((props) => (
              <ComboboxServiceItem
                key={props.id}
                name={props.serviceName}
                displayName={props.displayName}
                {...props}
                isDisabled={disabledServices.includes(props.serviceName)}
              />
            ))}
          </OdsComboboxGroup>
        </OdsCombobox>
        {!!selectedService && (
          <div slot="helper">
            <div className="mt-1">
              {!isServiceInfoLoading &&
                (serviceStatus !== 'ok' || hasServiceInfoError) && (
                  <OdsMessage
                    className="block max-w-[384px]"
                    color={ODS_MESSAGE_COLOR.danger}
                    isDismissible={false}
                  >
                    {t(
                      `service_selection_${serviceStatus ||
                        'expired'}_error_message`,
                    )}
                  </OdsMessage>
                )}
              <ServiceRegion />
            </div>
          </div>
        )}
      </OdsFormField>
    </OrderSection>
  );
};
