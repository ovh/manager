import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge } from '@ovhcloud/ods-react';

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
    rule?.state === 'ok' ? BADGE_COLOR.success : BADGE_COLOR.information;

  return (
    <Badge size={BADGE_SIZE.lg} color={color}>
      {t(`${rule?.state}-status`)}
    </Badge>
  );
};
