import React from 'react';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Tooltip,
  Text,
  Icon,
  TooltipTrigger,
  TooltipContent,
  BADGE_COLOR,
  ICON_NAME,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { TOngoingOperations } from '@/types';
import { StatusEnum } from '@/enum/status.enum';

interface OngoingOperationDatagridBadgeProps {
  readonly props: TOngoingOperations;
}

export default function OngoingOperationDatagridBadge({
  props,
}: OngoingOperationDatagridBadgeProps) {
  const { t } = useTranslation('dashboard');
  const formatDate = useFormatDate();

  const badgeColor = (status: string) => {
    switch (status) {
      case StatusEnum.TODO:
        return BADGE_COLOR.information;
      case StatusEnum.DOING:
        return BADGE_COLOR.information;
      case StatusEnum.PROBLEM:
        return BADGE_COLOR.critical;
      case StatusEnum.ERROR:
        return BADGE_COLOR.warning;
      case StatusEnum.DONE:
        return BADGE_COLOR.success;
      case StatusEnum.CANCELLED:
        return BADGE_COLOR.neutral;
      default:
        return BADGE_COLOR.information;
    }
  };

  const printIconAndTooltip: boolean =
    props.status === StatusEnum.TODO ||
    (props.status === StatusEnum.DONE && props.doneDate !== '');

  return (
    <div className="flex items-center gap-x-1">
      <Badge
        id={`status-${props.id}`}
        color={badgeColor(props.status)}
        data-testid={`status-${props.id}`}
        icon-alignment="right"
        tabIndex={0}
      >
        {t(`domain_operations_statusOperation_${props.status}`)}
        {printIconAndTooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon name={ICON_NAME.circleInfo} />
            </TooltipTrigger>
            <TooltipContent>
              <Text preset={TEXT_PRESET.span}>
                {`${t(
                  props.status === StatusEnum.TODO
                    ? 'domain_operations_statusOperation_todo_next_execution'
                    : 'domain_operations_statusOperation_done_end_execution',
                )} ${formatDate({ date: props.todoDate, format: 'P p' })}`}
              </Text>
            </TooltipContent>
          </Tooltip>
        )}
      </Badge>
    </div>
  );
}
