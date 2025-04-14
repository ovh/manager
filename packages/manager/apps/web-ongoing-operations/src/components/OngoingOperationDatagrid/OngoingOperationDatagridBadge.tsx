import React from 'react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components/src/components/badge/src/constants/badge-color';
import { OdsBadge, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { formatDatagridDate } from '@/utils/utils';
import { TOngoingOperations } from '@/types';
import { StatusEnum } from '@/enum/status.enum';

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
      case StatusEnum.TODO:
        return ODS_BADGE_COLOR.information;
      case StatusEnum.DOING:
        return ODS_BADGE_COLOR.information;
      case StatusEnum.PROBLEM:
        return ODS_BADGE_COLOR.critical;
      case StatusEnum.ERROR:
        return ODS_BADGE_COLOR.warning;
      case StatusEnum.DONE:
        return ODS_BADGE_COLOR.success;
      case StatusEnum.CANCELLED:
        return ODS_BADGE_COLOR.neutral;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };

  const printIconAndTooltip: boolean =
    props.status === StatusEnum.TODO ||
    (props.status === StatusEnum.DONE && props.doneDate !== '');

  return (
    <div className="flex items-center gap-x-1">
      <OdsBadge
        id={`status-${props.id}`}
        color={badgeColor(props.status)}
        label={t(`domain_operations_statusOperation_${props.status}`)}
        data-testid={`status-${props.id}`}
        icon={printIconAndTooltip ? ODS_ICON_NAME.circleInfo : null}
        icon-alignment="right"
        tabIndex={0}
      />

      {printIconAndTooltip && (
        <div>
          <OdsTooltip
            triggerId={`status-${props.id}`}
            role="tooltip"
            strategy="fixed"
          >
            <OdsText preset={ODS_TEXT_PRESET.span}>
              {`${t(
                props.status === StatusEnum.TODO
                  ? 'domain_operations_statusOperation_todo_next_execution'
                  : 'domain_operations_statusOperation_done_end_execution',
              )} ${formatDatagridDate(props.todoDate, locale)}`}
            </OdsText>
          </OdsTooltip>
        </div>
      )}
    </div>
  );
}
