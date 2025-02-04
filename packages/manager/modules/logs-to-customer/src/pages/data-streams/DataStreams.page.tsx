import {
  CommonTitle,
  Description,
  Links,
  LinkType,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
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

  const { data: logsServices, isPending, error } = useLogServices();

  useEffect(() => {
    if (!isPending && logsServices?.length > 0) {
      setCurrentService(logsServices[0]);
    }
  }, [logsServices, isPending]);

  if (isPending)
    return (
      <div className="flex py-8">
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="logServices-spinner"
        />
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

  if (logsServices.length === 0)
    return <Description>{t('log_kind_empty_state_description')}</Description>;

  if (!currentService)
    return <Description>{t('log_kind_no_kind_selected')}</Description>;

  return (
    <div className="flex flex-col gap-4">
      <Links
        type={LinkType.back}
        label={t('log_streams_back_link')}
        onClickReturn={() => navigate('..')}
      />
      <CommonTitle typoSize={ODS_THEME_TYPOGRAPHY_SIZE._500}>
        {t('log_streams_title')}
      </CommonTitle>
      <Description>{t('log_streams_back_description')}</Description>
      {logsServices.length > 1 && (
        <div className="flex flex-col gap-4 ">
          <OsdsSelect
            value={currentService?.serviceName}
            onOdsValueChange={(event) => {
              const newLogService = logsServices.find(
                (k) => k.serviceName === event.detail.value,
              );
              if (newLogService) setCurrentService(newLogService);
            }}
            data-testid={'logKindSelect'}
          >
            {logsServices.map((s) => (
              <OsdsSelectOption key={s.serviceName} value={s.serviceName}>
                {`${s.serviceName}${
                  s.displayName ? ` - ${s.displayName}` : ''
                }`}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
        </div>
      )}
      <DataStreamsDatagrid service={currentService} />
    </div>
  );
}
