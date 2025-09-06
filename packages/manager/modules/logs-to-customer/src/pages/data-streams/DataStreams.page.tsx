import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsSelect, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import ApiError from '../../components/apiError/ApiError.component';
import KnowMoreLink from '../../components/services/KnowMoreLink.component';
import OrderServiceButton from '../../components/services/OrderServiceButton.component';
import ServiceLink from '../../components/services/ServiceLink.component';
import { getLogServicesQueryKey, useLogServices } from '../../data/hooks/useLogService';
import { Service } from '../../data/types/dbaas/logs';
import getServiceLabel from '../../helpers/getServiceLabel';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';
import { LogsActionEnum } from '../../types/logsTracking';
import DataStreamsDatagrid from './DataStreamsDatagrid.component';

const BackButton = () => {
  const { t } = useTranslation('logStreams');
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const subscribeLogsAccessAction = useLogTrackingActions(LogsActionEnum.subscribe_logs_access);

  return (
    <OdsButton
      icon="arrow-left"
      iconAlignment="left"
      size="sm"
      variant="outline"
      label={t('log_streams_back_button')}
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [subscribeLogsAccessAction],
        });
        navigate('..');
      }}
    />
  );
};

export default function DataStreams() {
  const queryClient = useQueryClient();
  const { t } = useTranslation('logStreams');
  const { t: tService } = useTranslation('logService');
  const [currentService, setCurrentService] = useState<Service>();

  const { data: logServices, isPending, error } = useLogServices();

  useEffect(() => {
    if (!isPending && logServices && logServices.length > 0) {
      setCurrentService(logServices[0]);
    }
  }, [logServices, isPending]);

  if (isPending)
    return (
      <div className="flex py-8">
        <OdsSpinner size="md" data-testid="logServices-spinner" />
      </div>
    );

  if (error)
    return (
      <ApiError
        testId="logServices-error"
        error={error}
        onRetry={() =>
          void queryClient.refetchQueries({
            queryKey: getLogServicesQueryKey(),
          })
        }
      />
    );

  if (logServices.length === 0)
    return (
      <div className="flex flex-col gap-3">
        <OdsText preset="paragraph">
          {tService('log_service_no_service_description')} <KnowMoreLink />
        </OdsText>
        <div className="flex items-center gap-3">
          <BackButton />
          <OrderServiceButton />
        </div>
      </div>
    );

  if (!currentService)
    return <OdsText preset="paragraph">{t('log_kind_no_kind_selected')}</OdsText>;

  return (
    <div className="flex flex-col gap-4">
      <OdsText preset="heading-3">{t('log_streams_title')}</OdsText>
      <div className="flex flex-col gap-2">
        <OdsText preset="paragraph">{t('log_streams_select_account')}</OdsText>
        <div className="flex flex-col md:flex-row gap-2">
          <OdsSelect
            className="w-full md:w-96"
            value={currentService?.serviceName}
            isDisabled={logServices.length === 1}
            onOdsChange={(event) => {
              const newLogService = logServices.find((k) => k.serviceName === event.detail.value);
              if (newLogService) setCurrentService(newLogService);
            }}
            data-testid={'logKindSelect'}
            name="select-log-service"
          >
            {logServices.map((s) => {
              return (
                <option key={s.serviceName} value={s.serviceName}>
                  {getServiceLabel(s)}
                </option>
              );
            })}
          </OdsSelect>
          <BackButton />
        </div>
      </div>
      <div className="flex gap-3">
        <OdsText>{t('log_streams_account_label')}</OdsText>
        <ServiceLink service={currentService} />
      </div>
      <DataStreamsDatagrid service={currentService} />
    </div>
  );
}
