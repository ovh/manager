import React, { useMemo } from 'react';
import { useTranslation, getI18n } from 'react-i18next';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { TOngoingOperations } from 'src/types';
import { formatDate, removeString } from '@/utils/utils';
import OngoingOperationDatagridBadge from '@/components/OngoingOperationDatagridBadge/OngoingOperationDatagridBadge';

export const useOngoingOperationDatagridColumns = (
  isDomain: boolean,
  data: any,
) => {
  const { t } = useTranslation('dashboard');
  const l = getI18n();
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        id: 'domain',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            <OdsLink
              href={`https://www.ovh.com/manager/#/web/domain/${
                isDomain ? props.domain : props.zone
              }/information`}
              label={isDomain ? props.domain : props.zone}
              target="_blank"
              data-testid={isDomain ? props.domain : props.zone}
              href={`https://www.ovh.com/manager/#/web/domain/${props.domain}/information`}
              label={props.domain}
              target="_blank"
              data-testid={props.domain}
            />
          </DataGridTextCell>
        ),
        label: isDomain
          ? t('domain_operations_table_header_domain')
          : t('dns_operations_table_header_domain'),
      },
      {
        id: 'operation',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {t(`domain_operations_nicOperation_${props.function}`)}
          </DataGridTextCell>
        ),
        label: t('domain_operations'),
      },
      {
        id: 'comment',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {props.comment ? removeString(props.comment) : '-'}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_comment'),
      },
      {
        id: 'created_on',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {formatDate(props.creationDate, l.language)}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_creationDate'),
      },
      {
        id: 'last_updated',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {formatDate(props.lastUpdate, l.language)}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_lastUpdate'),
      },
      {
        id: 'status',
        cell: (props: TOngoingOperations) => (
          <OngoingOperationDatagridBadge props={props} locale={l.language} />
        ),
        label: t('domain_operations_table_header_status'),
      },
      {
        cell: (props: TOngoingOperations) => (
          <div className="flex items-center justify-center">
            <ActionMenu
              id={`${props.id}`}
              isCompact
              isDisabled={
                !props.canAccelerate && !props.canRelaunch && !props.canCancel
              }
              items={[
                {
                  id: 1,
                  label: t('domain_operations_tab_popover_update'),
                  className:
                    !props.canAccelerate &&
                    !props.canRelaunch &&
                    !props.canCancel &&
                    'hidden',
                },
                {
                  id: 2,
                  label: t('domain_operations_tab_popover_progress'),
                  className:
                    props.function !== 'DomainIncomingTransfer' && 'hidden',
                  onClick: () => navigate(`/tracking/${props.id}`),
                },
              ]}
            />
          </div>
        ),
        id: 'actions',
        label: t('domain_operations_table_header_actions'),
      },
    ],
    [t, data],
  );
};
