import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IpGameFirewallStateEnum, IpGameFirewallType } from '@/data/api';
import { datagridCellStyle } from '../datagridCellStyles';
import { IconCell } from '../IconCell/IconCell';

export type IpGameFirewallDisplayProps = {
  ip: string;
  ipGameFirewall: IpGameFirewallType;
  enabled: boolean;
};

/**
 * Component to display the cell content for Game Firewall.
 * If game firewall not enabled display nothing
 * If game firewall state is OK we display available state to user
 * If game firewall state is not ok we display the pending state to user
 * @param ip the original ip used for gameFirewall request
 * @param ipEdgeFirewall the gameFirewall object for given ip (can be null)
 * @param enabled boolean used to display datas or not
 * @returns React component
 */
export const IpGameFirewallDisplay = ({
  ip,
  ipGameFirewall,
  enabled,
}: IpGameFirewallDisplayProps) => {
  const id = `gamefirewall-${ip.replace(/\/|\./g, '-')}`;
  const { t } = useTranslation('listing');

  return (
    <>
      {enabled && ipGameFirewall?.state === IpGameFirewallStateEnum.OK && (
        <IconCell
          icon={ODS_ICON_NAME.gameControllerAlt}
          text={t('listingColumnsIpGameFirewallAvailable')}
        />
      )}
      {enabled &&
        !!ipGameFirewall &&
        ipGameFirewall.state !== IpGameFirewallStateEnum.OK && (
          <IconCell
            icon={ODS_ICON_NAME.gameControllerAlt}
            text={t('listingColumnsIpGameFirewallPending')}
            tooltip={t('listingColumnsIpGameFirewallPendingTooltip')}
            trigger={id}
            style={datagridCellStyle.iconWarning}
          />
        )}
    </>
  );
};
