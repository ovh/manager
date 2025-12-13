import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Button, Icon, ICON_NAME, Select, SelectContent, SelectControl, Spinner, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import ApiError from '@/components/apiError/ApiError.component';
import KnowMoreLink from '@/components/services/KnowMoreLink.component';
import OrderServiceButton from '@/components/services/OrderServiceButton.component';
import ServiceLink from '@/components/services/ServiceLink.component';
import { getLogServicesQueryKey, useLogServices } from '@/data/hooks/useLogService';
import { Service } from '@/data/types/dbaas/logs';
import getServiceLabel from '@/helpers/getServiceLabel';
import useLogTrackingActions from '@/hooks/useLogTrackingActions';
import { LogsActionEnum } from '@/types/logsTracking';
import DataStreamsDatagrid from '@/pages/data-streams/DataStreamsDatagrid.component';
import { NAMESPACES } from '@/LogsToCustomer.translations';

const BackButton = () => {
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const subscribeLogsAccessAction = useLogTrackingActions(LogsActionEnum.subscribe_logs_access);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: [subscribeLogsAccessAction],
        });
        navigate('..');
      }}
    >
      <>
        <Icon name={ICON_NAME.arrowLeft} />
        {t('log_streams_back_button')}
      </>
    </Button>
  );
};

export default function DataStreams() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const { t: tService } = useTranslation(NAMESPACES.LOG_SERVICE);
  const [currentService, setCurrentService] = useState<Service>();

  const { data: logServices, isPending, error } = useLogServices();

  useEffect(() => {
    if (!isPending && logServices && logServices.length > 0 && !currentService) {
      setCurrentService(logServices[0]);
    }
  }, [logServices, isPending, currentService]);

  if (isPending)
    return (
      <div className="flex py-8">
        <Spinner size="md" data-testid="logServices-spinner" />
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
        <Text preset="paragraph">
          {tService('log_service_no_service_description')} <KnowMoreLink />
        </Text>
        <div className="flex items-center gap-3">
          <BackButton />
          <OrderServiceButton />
        </div>
      </div>
    );

  if (!currentService)
    return <Text preset="paragraph">{t('log_kind_no_kind_selected')}</Text>;

  return (
    <div className="flex flex-col gap-4">
      <Text preset="heading-3">{t('log_streams_title')}</Text>
      <div className="flex flex-col gap-2">
        <Text preset="paragraph">{t('log_streams_select_account')}</Text>
        <div className="flex flex-col md:flex-row gap-2">
          <Select
            className="md:w-96"
            value={currentService?.serviceName ? [currentService.serviceName] : undefined}
            disabled={logServices.length === 1}
            items={logServices.map((s) => ({
              value: s.serviceName,
              label: getServiceLabel(s),
            }))}
            onValueChange={(detail) => {
              const selectedValue = detail.value[0];
              const newLogService = logServices.find((k) => k.serviceName === selectedValue);
              if (newLogService) setCurrentService(newLogService);
            }}
            data-testid={'logKindSelect'}
            name="select-log-service"
          >
            <SelectControl />
            <SelectContent />
          </Select>
          <BackButton />
        </div>
      </div>
      <div className="flex gap-3">
        <Text>{t('log_streams_account_label')}</Text>
        <ServiceLink service={currentService} />
      </div>
      <DataStreamsDatagrid service={currentService} />
    </div>
  );
}
