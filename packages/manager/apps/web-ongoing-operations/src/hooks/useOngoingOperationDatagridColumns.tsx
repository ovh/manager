import React, { useMemo } from 'react';
import { useTranslation, getI18n } from 'react-i18next';
import {
  ActionMenu,
  DataGridTextCell,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOngoingOperations } from 'src/types';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ParentEnum } from '@/enum/parent.enum';
import { formatDatagridDate, removeQuotes } from '@/utils/utils';
import OngoingOperationDatagridDomain from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridDomain';
import OngoingOperationDatagridBadge from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridBadge';
import { DNS_OPERATIONS_TABLE_HEADER_DOMAIN } from '@/pages/dashboard/Dashboard';

export const useOngoingOperationDatagridColumns = (
  parent: ParentEnum.DOMAIN | ParentEnum.ZONE,
  data: TOngoingOperations[],
) => {
  const { t } = useTranslation('dashboard');
  const { clearNotifications } = useNotifications();
  const l = getI18n();
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(
    () => [
      {
        id: parent,
        cell: (props: TOngoingOperations) => (
          <OngoingOperationDatagridDomain parent={parent} props={props} />
        ),
        label:
          parent === ParentEnum.DOMAIN
            ? t('domain_operations_table_header_domain')
            : DNS_OPERATIONS_TABLE_HEADER_DOMAIN,
        comparator: FilterCategories.String,
        isFilterable: true,
      },
      {
        id: 'function',
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
      },
      {
        cell: (props: TOngoingOperations) => (
          <ActionMenu
            id={`${props.id}`}
            isCompact
            isDisabled={
              !props.canAccelerate && !props.canRelaunch && !props.canCancel
            }
            variant={ODS_BUTTON_VARIANT.ghost}
            items={[
              {
                id: 1,
                label: t('domain_operations_tab_popover_update'),
                className: `${!props.canAccelerate &&
                  !props.canRelaunch &&
                  !props.canCancel &&
                  'hidden'} menu-item-button`,
                onClick: () => {
                  navigate(`${location.pathname}/update/${props.id}`);
                  clearNotifications();
                },
              },
              {
                id: 2,
                label: t('domain_operations_tab_popover_progress'),
                className: `${props.function !== 'DomainIncomingTransfer' &&
                  'hidden'} menu-item-button`,
                onClick: () => navigate(`/tracking/${props.id}`),
              },
            ]}
          />
        ),
        id: 'actions',
        label: '',
        isSortable: false,
      },
    ],
    [t, data],
  );
};
