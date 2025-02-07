import { Links, LinkType } from '@ovh-ux/manager-react-components';
import { OdsSelect, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ApiError from '../../components/apiError/ApiError.component';
import {
  getLogServicesQueryKey,
  useLogServices,
} from '../../data/hooks/useLogService';

import { Service } from '../../data/types/dbaas/logs';
import DataStreamsDatagrid from './DataStreamsDatagrid.component';

export default function DataStreams() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation('logStreams');
  const [currentService, setCurrentService] = useState<Service>();

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
      <Links
        type={LinkType.back}
        label={t('log_streams_back_link')}
        onClickReturn={() => navigate('..')}
      />
      <OdsText preset="heading-3">{t('log_streams_title')}</OdsText>
      <OdsText preset="paragraph">{t('log_streams_back_description')}</OdsText>
      {logServices.length > 1 && (
        <OdsSelect
          value={currentService?.serviceName}
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
            const optionLabel = s.displayName
              ? `${s.serviceName} - ${s.displayName}`
              : s.serviceName;

            return (
              <option key={s.serviceName} value={s.serviceName}>
                {optionLabel}
              </option>
            );
          })}
        </OdsSelect>
      )}
      <DataStreamsDatagrid service={currentService} />
    </div>
  );
}
