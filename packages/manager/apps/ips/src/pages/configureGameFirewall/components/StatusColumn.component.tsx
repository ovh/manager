import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { IpGameFirewallRule } from '@/data/api';

export const StatusColumn = (
  rule?: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { t } = useTranslation('game-firewall');

  if (!rule || rule?.isNew) {
    return null;
  }

  const color =
    rule?.state === 'ok'
      ? ODS_BADGE_COLOR.success
      : ODS_BADGE_COLOR.information;

  return (
    <OdsBadge
      size={ODS_BADGE_SIZE.lg}
      color={color}
      label={t(`${rule?.state}-status`)}
    />
  );
};
