import {
  OdsButton,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import ApiError from '../../components/apiError/ApiError.component';
import {
  getLogServicesQueryKey,
  useLogServices,
} from '../../data/hooks/useLogService';
import { Service } from '../../data/types/dbaas/logs';
import DataStreamsDatagrid from './DataStreamsDatagrid.component';
import getServiceLabel from '../../helpers/getServiceLabel';
import ServiceLink from '../../components/services/ServiceLink.component';
import { LogsActionEnum } from '../../types/logsTracking';
import useLogTrackingActions from '../../hooks/useLogTrackingActions';

export default function DataStreams() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation('logStreams');
  const { trackClick } = useOvhTracking();
  const [currentService, setCurrentService] = useState<Service>();
  const subscribeLogsAccessAction = useLogTrackingActions(
    LogsActionEnum.subscribe_logs_access,
  );

  const { data: logServices, isPending, error } = useLogServices();

  useEffect(() => {
    if (!isPending && logServices?.length > 0) {
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
          queryClient.refetchQueries({
            queryKey: getLogServicesQueryKey(),
          })
        }
      />
    );

  if (logServices.length === 0)
    return (
      <OdsText preset="paragraph">
        {t('log_kind_empty_state_description')}
      </OdsText>
    );

  if (!currentService)
    return (
      <OdsText preset="paragraph">{t('log_kind_no_kind_selected')}</OdsText>
    );

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
              const newLogService = logServices.find(
                (k) => k.serviceName === event.detail.value,
              );
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
          <OdsButton
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
