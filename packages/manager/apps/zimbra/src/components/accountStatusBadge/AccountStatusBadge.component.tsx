import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_ICON_ALIGNMENT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { TOOLTIP_POSITION, Tooltip, TooltipContent, TooltipTrigger } from '@ovh-ux/muk';

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
      return ODS_BADGE_COLOR.critical;
    default:
      return ODS_BADGE_COLOR.information;
  }
};

export const AccountStatusBadge: React.FC<EmailAccountItem> = (props) => {
  const { t } = useTranslation('common');

  if (props.status === ResourceStatus.READY && props.detailedStatus.length > 0) {
    const statusBadge = props.detailedStatus.flatMap(({ status }) => {
      return CurrentAccountStatusLabels[status] ? (
        <Tooltip key={`${props.id}_${status}`} position={TOOLTIP_POSITION.bottom}>
          <TooltipTrigger asChild>
            <OdsBadge
              data-testid={`${props.id}_${status}`}
              color={getStatusColor(status)}
              className="capitalize m-1"
              label={t(CurrentAccountStatusLabels[status])}
              iconAlignment={ODS_BADGE_ICON_ALIGNMENT.right}
              {...(CurrentAccountTooltipContent[status] ? { icon: ODS_ICON_NAME.circleInfo } : {})}
            />
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
