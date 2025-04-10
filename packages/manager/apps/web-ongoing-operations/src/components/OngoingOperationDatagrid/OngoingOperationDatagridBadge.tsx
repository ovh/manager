import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components/src/components/badge/src/constants/badge-color';
import {
  OdsBadge,
  OdsIcon,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { formatDatagridDate } from '@/utils/utils';
import { TOngoingOperations } from '@/types';

interface OngoingOperationDatagridBadgeProps {
  readonly props: TOngoingOperations;
  readonly locale: string;
}

export default function OngoingOperationDatagridBadge({
  props,
  locale,
}: OngoingOperationDatagridBadgeProps) {
  const { t } = useTranslation('dashboard');
  const badgeColor = (status: string) => {
    switch (status) {
      case 'todo':
        return ODS_BADGE_COLOR.information;
      case 'doing':
        return ODS_BADGE_COLOR.information;
      case 'problem':
        return ODS_BADGE_COLOR.critical;
      case 'error':
        return ODS_BADGE_COLOR.warning;
      case 'done':
        return ODS_BADGE_COLOR.success;
      case 'cancelled':
        return ODS_BADGE_COLOR.neutral;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };
  return (
    <div className="flex items-center gap-x-1">
      <OdsBadge
        color={badgeColor(props.status)}
        label={t(`domain_operations_statusOperation_${props.status}`)}
        data-testid={`status-${props.id}`}
      />

      {props.status === 'todo' && (
        <div>
          <OdsIcon id={`trigger-${props.id}`} name="circle-question" />
          <OdsTooltip
            triggerId={`trigger-${props.id}`}
            role="tooltip"
            strategy="fixed"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {`${t(
                'domain_operations_statusOperation_todo_next_execution',
              )} ${formatDatagridDate(props.todoDate, locale)}`}
            </OdsText>
          </OdsTooltip>
        </div>
      )}

      {props.status === 'done' && props.doneDate && (
        <div>
          <OdsIcon id={`trigger-${props.id}`} name="circle-question" />
          <OdsTooltip
            triggerId={`trigger-${props.id}`}
            role="tooltip"
            strategy="fixed"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {`${t(
                'domain_operations_statusOperation_done_end_execution',
              )} ${formatDatagridDate(props.doneDate, locale)}`}
            </OdsText>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
