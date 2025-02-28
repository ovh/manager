import React, { useMemo } from 'react';
import { useTranslation, getI18n } from 'react-i18next';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { TOngoingOperations } from 'src/types';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { formatDatagridDate, removeQuotes } from '@/utils/utils';
import OngoingOperationDatagridBadge from '@/components/OngoingOperationDatagridBadge/OngoingOperationDatagridBadge';
import { UseManagerUrl } from '@/hooks/url/useManagerUrl';

export enum ParentEnum {
  Domain = 'domain',
  Zone = 'zone',
}

export const useOngoingOperationDatagridColumns = (
  parent: ParentEnum.Domain | ParentEnum.Zone,
  data: TOngoingOperations[],
) => {
  const { t } = useTranslation('dashboard');
  const l = getI18n();
  const navigate = useNavigate();

  return useMemo(
    () => [
      {
        id: parent,
        cell: (props: TOngoingOperations) => {
          const value: string = props[parent];
          const url: string = UseManagerUrl(parent, value);
          return (
            <DataGridTextCell>
              <OdsLink
                href={url}
                label={value}
                target="_blank"
                data-testid={value}
              />
            </DataGridTextCell>
          );
        },
        label:
          parent === ParentEnum.Domain
            ? t('domain_operations_table_header_domain')
            : t('dns_operations_table_header_domain'),
        comparator: FilterCategories.String,
        isFilterable: true,
      },
      {
        id: 'operation',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {t(`domain_operations_nicOperation_${props.function}`)}
          </DataGridTextCell>
        ),
        label: t('domain_operations'),
        comparator: FilterCategories.String,
        isFilterable: true,
      },
      {
        id: 'comment',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {props.comment ? removeQuotes(props.comment) : '-'}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_comment'),
      },
      {
        id: 'created_on',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {formatDatagridDate(props.creationDate, l.language)}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_creationDate'),
      },
      {
        id: 'last_updated',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {formatDatagridDate(props.lastUpdate, l.language)}
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
        comparator: FilterCategories.String,
        isFilterable: true,
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
        isSortable: false,
      },
    ],
    [t, data],
  );
};
