import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BADGE_COLOR,
  ODS_BADGE_ICON_ALIGNMENT,
  ODS_ICON_NAME,
  ODS_TOOLTIP_POSITION,
} from '@ovhcloud/ods-components';
import { OdsBadge, OdsTooltip } from '@ovhcloud/ods-components/react';

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
        <React.Fragment key={`${props.id}_${status}`}>
          <OdsBadge
            data-testid={`${props.id}_${status}`}
            id={`current-account-status-${props.id}_${status}`}
            color={getStatusColor(status)}
            className="capitalize m-1"
            label={t(CurrentAccountStatusLabels[status])}
            iconAlignment={ODS_BADGE_ICON_ALIGNMENT.right}
            {...(CurrentAccountTooltipContent[status] ? { icon: ODS_ICON_NAME.circleInfo } : {})}
          />
          {CurrentAccountTooltipContent[status] && (
            <OdsTooltip
              withArrow
              position={ODS_TOOLTIP_POSITION.bottom}
              triggerId={`current-account-status-${props.id}_${status}`}
            >
              {t(CurrentAccountTooltipContent[status])}
            </OdsTooltip>
          )}
        </React.Fragment>
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
