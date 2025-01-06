import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActionMenu, DataGridTextCell } from "@ovh-ux/manager-react-components";
import { OdsBadge, OdsLink } from "@ovhcloud/ods-components/react";
import { ODS_BADGE_COLOR } from "@ovhcloud/ods-components/src/components/badge/src/constants/badge-color";
import { useFormatDate } from "@/hooks/date/useFormatDate";
import { TOngoingOperations } from "@/interface";

export const useDatagridColumn = (openModal: (id: number) => void, isDomain : boolean, flattenData: object) => {
  const { t } = useTranslation('dashboard');

  const badgeColor = (props: string) => {
    switch (props) {
      case 'todo':
        return ODS_BADGE_COLOR.warning;
      case 'error':
        return ODS_BADGE_COLOR.critical;
      case 'success':
        return ODS_BADGE_COLOR.success;
      case 'cancel':
        return ODS_BADGE_COLOR.neutral;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };

  const formatColumnComment = (data: string) => {
    if(data[0] === '"' && data.slice(-1) === '"') {
      return data.replace(/"/g, '');
    }
    return data;
  };

  return useMemo(
    () => [
      {
        id: 'domain',
        cell: (props: TOngoingOperations) => (
          // TODO: Changer la génération du lien
          <OdsLink
            href={`https://www.ovh.com/manager/#/web/domain/${props.domain}/information`}
            label={props.domain}
            target="_blank"
          />
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
          <DataGridTextCell>{props.comment}</DataGridTextCell>
        ),
        label: t('domain_operations_table_header_comment'),
      },
      {
        id: 'created_on',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>
            {useFormatDate(props.creationDate)}
          </DataGridTextCell>
        ),
        label: t('domain_operations_table_header_creationDate'),
      },
      {
        id: 'date_processed',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>{useFormatDate(props.todoDate)}</DataGridTextCell>
        ),
        label: t('domain_operations_table_header_todoDate'),
      },
      {
        id: 'last_updated',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>{useFormatDate(props.lastUpdate)}</DataGridTextCell>
        ),
        label: t('domain_operations_table_header_lastUpdate'),
      },
      {
        id: 'end_date',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>{props?.endDate}</DataGridTextCell>
        ),
        label: t('domain_operations_table_header_doneDate'),
      },
      {
        id: 'status',
        cell: (props: TOngoingOperations) => (
          <OdsBadge
            color={badgeColor(props.status)}
            label={t(`domain_operations_statusOperation_${props.status}`)}
          />
        ),
        label: t('domain_operations_table_header_status'),
      },
      {
        cell: (props: TOngoingOperations) => (
          <div className="flex items-center justify-center">
            <div>
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
                      props.canAccelerate ||
                      props.canRelaunch ||
                      props.canCancel
                        ? ''
                        : 'hidden',
                    onClick: () => openModal(props.id),
                  },
                  {
                    id: 2,
                    label: t('domain_operations_tab_popover_progress'),
                    className:
                      props.function === 'DomainIncomingTransfer'
                        ? ''
                        : 'hidden',
                  },
                ]}
              />
            </div>
          </div>
        ),
        id: 'actions',
        label: t('domain_operations_table_header_actions'),
      },
    ],
    [t, flattenData],
  );
};
