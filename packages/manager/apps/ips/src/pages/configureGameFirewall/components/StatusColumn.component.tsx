import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { IpGameFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

export const StatusColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.gameFirewall);

  if (!rule || rule?.isNew) {
    return <></>;
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
