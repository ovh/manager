import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionMenu, DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  OdsBadge,
  OdsLink,
  OdsText,
  OdsTooltip,
  OdsIcon,
} from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components/src/components/badge/src/constants/badge-color';
import { useNavigate } from 'react-router-dom';
import { useFormatDate } from '@/hooks/date/useFormatDate';
import { TOngoingOperations } from '@/interface';

export const useDatagridColumn = (
  openModal: (id: number) => void,
  isDomain: boolean,
  flattenData: unknown[],
) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const badgeColor = (props: string) => {
    switch (props) {
      case 'todo':
        return ODS_BADGE_COLOR.warning;
      case 'error':
        return ODS_BADGE_COLOR.critical;
      case 'done':
        return ODS_BADGE_COLOR.success;
      case 'cancelled':
        return ODS_BADGE_COLOR.neutral;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };

  const formatColumnComment = (comment: string) => {
    if (comment) {
      if (comment[0] === '"' && comment.slice(-1) === '"') {
        return comment.replace(/"/g, '');
      }
      return comment;
    }
    return comment;
  };

  return useMemo(
    () => [
      {
        id: 'domain',
        cell: (props: TOngoingOperations) => (
          <OdsLink
            href={`https://www.ovh.com/manager/#/web/domain/${props.domain}/information`}
            label={isDomain ? props.domain : props.zone}
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
          <DataGridTextCell>
            {formatColumnComment(props.comment)}
          </DataGridTextCell>
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
        id: 'last_updated',
        cell: (props: TOngoingOperations) => (
          <DataGridTextCell>{useFormatDate(props.lastUpdate)}</DataGridTextCell>
        ),
        label: t('domain_operations_table_header_lastUpdate'),
      },
      {
        id: 'status',
        cell: (props: TOngoingOperations) => (
          <div className="flex items-center gap-x-1">
            <OdsBadge
              color={badgeColor(props.status)}
              label={t(`domain_operations_statusOperation_${props.status}`)}
            />
            {props.status === 'todo' && (
              <div>
                <OdsIcon id={`trigger-${props.id}`} name="circle-question" />
                <OdsTooltip
                  triggerId={`trigger-${props.id}`}
                  role="tooltip"
                  strategy="fixed"
                >
                  <OdsText>Prochaine exécution le {useFormatDate(props.todoDate)}</OdsText>
                </OdsTooltip>
              </div>
            )}
            {props.status === 'done' && (
              <div>
                <OdsIcon id={`trigger-${props.id}`} name="circle-question" />
                <OdsTooltip
                  triggerId={`trigger-${props.id}`}
                  role="tooltip"
                  strategy="fixed"
                >
                  <OdsText>Fin de l'exécution le {props.endDate}</OdsText>
                </OdsTooltip>
              </div>
            )}
          </div>
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
                    onClick: () => navigate(`/tracking/${props.id}`),
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
