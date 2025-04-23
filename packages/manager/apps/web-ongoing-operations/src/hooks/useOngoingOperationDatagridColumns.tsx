import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionMenu,
  DataGridTextCell,
  useNotifications,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOngoingOperations } from 'src/types';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ParentEnum } from '@/enum/parent.enum';
import { removeQuotes } from '@/utils/utils';
import OngoingOperationDatagridDomain from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridDomain';
import OngoingOperationDatagridBadge from '@/components/OngoingOperationDatagrid/OngoingOperationDatagridBadge';
import { DNS_OPERATIONS_TABLE_HEADER_DOMAIN } from '@/pages/dashboard/Dashboard';
import { StatusEnum } from '@/enum/status.enum';
import {
  DomainOperations,
  DNSOperations,
  DomainOperationsEnum,
} from '@/constants';

export const useOngoingOperationDatagridColumns = (
  searchableColumnID: string,
  parent: ParentEnum,
) => {
  const { t } = useTranslation('dashboard');
  const { clearNotifications } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const formatDate = useFormatDate();

  const columns = [
    {
      id: searchableColumnID,
      cell: (props: TOngoingOperations) => (
        <OngoingOperationDatagridDomain parent={parent} props={props} />
      ),
      label:
        (parent === ParentEnum.DOMAIN &&
          t('domain_operations_table_header_domain')) ||
        (parent === ParentEnum.ZONE && DNS_OPERATIONS_TABLE_HEADER_DOMAIN) ||
        (parent === ParentEnum.ALLDOM &&
          t('domain_operations_table_header_name')),
      comparator: FilterCategories.String,
      isFilterable: true,
      isSearchable: true,
      enableHiding: false,
    },
    {
      id: 'function',
      cell: (props: TOngoingOperations) => (
        <DataGridTextCell>
          {t(`domain_operations_nicOperation_${props.function}`)}
        </DataGridTextCell>
      ),
      label: t('domain_operations'),
      comparator: FilterCategories.Options,
      isFilterable: true,
      enableHiding: false,
      filterOptions: (parent === ParentEnum.DOMAIN
        ? DomainOperations
        : DNSOperations
      ).map((op) => ({
        label: t(`domain_operations_nicOperation_${op}`),
        value: op,
      })),
    },
    {
      id: 'comment',
      cell: (props: TOngoingOperations) => (
        <DataGridTextCell>
          {props.comment ? removeQuotes(props.comment) : '-'}
        </DataGridTextCell>
      ),
      label: t('domain_operations_table_header_comment'),
      enableHiding: true,
    },
    {
      id: 'created_on',
      cell: (props: TOngoingOperations) => (
        <DataGridTextCell>
          {formatDate({ date: props.creationDate, format: 'P p' })}
        </DataGridTextCell>
      ),
      label: t('domain_operations_table_header_creationDate'),
      enableHiding: true,
    },
    {
      id: 'last_updated',
      cell: (props: TOngoingOperations) => (
        <DataGridTextCell>
          {formatDate({ date: props.lastUpdate, format: 'P p' })}
        </DataGridTextCell>
      ),
      label: t('domain_operations_table_header_lastUpdate'),
      enableHiding: true,
    },
    {
      id: 'status',
      cell: (props: TOngoingOperations) => (
        <OngoingOperationDatagridBadge props={props} />
      ),
      label: t('domain_operations_table_header_status'),
      comparator: FilterCategories.Options,
      isFilterable: true,
      enableHiding: false,
      filterOptions: Object.values(StatusEnum).map((status) => ({
        label: t(`domain_operations_statusOperation_${status}`),
        value: status,
      })),
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
              className: `${props.function !==
                DomainOperationsEnum.DomainIncomingTransfer &&
                'hidden'} menu-item-button`,
              onClick: () => navigate(`/tracking/${props.id}`),
            },
          ]}
        />
      ),
      id: 'actions',
      label: '',
      isSortable: false,
      enableHiding: false,
    },
  ];
  return columns;
};
