import React, { useMemo, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Select, SelectContent, SelectControl, Spinner, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/LogsToCustomer.translations';
import ApiError from '@/components/api-error/ApiError.component';
import KnowMoreLink from '@/components/services/KnowMoreLink.component';
import OrderServiceButton from '@/components/services/OrderServiceButton.component';
import ServiceLink from '@/components/services/ServiceLink.component';
import { getLogServicesQueryKey, useLogServices } from '@/data/hooks/useLogService';
import { Service } from '@/data/types/dbaas/logs/Logs.type';
import getServiceLabel from '@/helpers/getServiceLabel';
import BackButton from '@/pages/data-streams/BackButton.component';
import DataStreamsDatagrid from '@/pages/data-streams/DataStreamsDatagrid.component';

export default function DataStreams() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(NAMESPACES.LOG_STREAMS);
  const { t: tService } = useTranslation(NAMESPACES.LOG_SERVICE);

  const { data: logServices, isPending, error } = useLogServices();

  const defaultService = useMemo(
    () => (logServices && logServices.length > 0 ? logServices[0] : undefined),
    [logServices],
  );

  const [currentService, setCurrentService] = useState<Service | undefined>(defaultService);

  const effectiveService = currentService ?? defaultService;

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

  if (!effectiveService) return <Text preset="paragraph">{t('log_kind_no_kind_selected')}</Text>;

  const selectItems = logServices.map((s) => ({
    label: getServiceLabel(s),
    value: s.serviceName,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start">
        <BackButton />
      </div>
      <Text preset="heading-3">{t('log_streams_title')}</Text>
      <div className="flex flex-col gap-2">
        <Text preset="paragraph">{t('log_streams_select_account')}</Text>
        <div className="flex flex-col md:flex-row gap-4">
          <Select
            className="w-96 max-w-full"
            name="select-log-service"
            disabled={logServices.length === 1}
            value={effectiveService?.serviceName ? [effectiveService.serviceName] : []}
            onValueChange={(detail) => {
              const newLogService = logServices.find((k) => k.serviceName === detail?.value?.[0]);
              if (newLogService) setCurrentService(newLogService);
            }}
            data-testid="logKindSelect"
            items={selectItems}
          >
            <SelectControl />
            <SelectContent />
          </Select>
        </div>
      </div>
      <div className="flex gap-3">
        <Text>{t('log_streams_account_label')}</Text>
        <ServiceLink service={effectiveService} />
      </div>
      <DataStreamsDatagrid service={effectiveService} />
    </div>
  );
}
