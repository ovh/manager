import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BADGE_COLOR,
  Badge,
  ICON_NAME,
  Icon,
  TOOLTIP_POSITION,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { CurrentAccountStatus, ResourceStatus } from '@/data/api';
import { EmailAccountItem } from '@/pages/dashboard/emailAccounts/EmailAccounts.types';

import BadgeStatus from '../badgeStatus/BadgeStatus.component';

const CurrentAccountStatusLabels: Record<keyof typeof CurrentAccountStatus, string> = {
  [CurrentAccountStatus.BILLINGLOCKED]: 'service_state_suspended',
  [CurrentAccountStatus.BLOCKEDFORSPAM]: 'account_state_blockedforspam',
};

const CurrentAccountTooltipContent: Record<keyof typeof CurrentAccountStatus, string> = {
  [CurrentAccountStatus.BILLINGLOCKED]: 'account_state_tooltip_billinglocked',
  [CurrentAccountStatus.BLOCKEDFORSPAM]: 'account_state_tooltip_blockedforspam',
};

const getStatusColor = (status: keyof typeof CurrentAccountStatus) => {
  switch (status) {
    case CurrentAccountStatus.BILLINGLOCKED:
    case CurrentAccountStatus.BLOCKEDFORSPAM:
      return BADGE_COLOR.critical;
    default:
      return BADGE_COLOR.information;
  }
};

export const AccountStatusBadge: React.FC<EmailAccountItem> = (props) => {
  const { t } = useTranslation('common');

  if (props.status === ResourceStatus.READY && props.detailedStatus.length > 0) {
    const statusBadge = props.detailedStatus.flatMap(({ status }) => {
      return CurrentAccountStatusLabels[status] ? (
        <Tooltip key={`${props.id}_${status}`} position={TOOLTIP_POSITION.bottom}>
          <TooltipTrigger asChild>
            <Badge
              data-testid={`${props.id}_${status}`}
              color={getStatusColor(status)}
              className="m-1 capitalize"
            >
              {t(CurrentAccountStatusLabels[status])}
              {CurrentAccountTooltipContent[status] && <Icon name={ICON_NAME.circleInfo} />}
            </Badge>
          </TooltipTrigger>
          {CurrentAccountTooltipContent[status] && (
            <TooltipContent withArrow>{t(CurrentAccountTooltipContent[status])}</TooltipContent>
          )}
        </Tooltip>
      ) : (
        []
      );
    });
    if (statusBadge.length > 0) {
      return <>{statusBadge}</>;
    }
  }
  return (
    <BadgeStatus data-testid={`${props.id}_${props.status}`} status={props.status}></BadgeStatus>
  );
};

export default AccountStatusBadge;
