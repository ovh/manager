import React from 'react';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsButton, OdsBadge } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useIpGameFirewallRules } from '@/data/hooks';
import { IpGameFirewallRule } from '@/data/api';

const StatusColumn = (rule: IpGameFirewallRule) => {
  const { t } = useTranslation('game-firewall');
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

export type RuleDatagridProps = {
  ip: string;
  ipOnGame?: string;
};

export const RuleDatagrid: React.FC<RuleDatagridProps> = ({ ip, ipOnGame }) => {
  const { t } = useTranslation(['game-firewall', NAMESPACES.STATUS]);
  const { isLoading, data: rules } = useIpGameFirewallRules({
    ip,
    ipOnGame,
  });

  const columns: DatagridColumn<IpGameFirewallRule>[] = [
    {
      id: 'game-protocol',
      label: t('gameProtocolColumnLabel'),
      cell: (rule) => <OdsText>{rule?.protocol}</OdsText>,
    },
    {
      id: 'start-port',
      label: t('startPortColumnLabel'),
      cell: (rule) => <OdsText>{rule?.ports.from}</OdsText>,
    },
    {
      id: 'end-port',
      label: t('endPortColumnLabel'),
      cell: (rule) => <OdsText>{rule?.ports.to}</OdsText>,
    },
    {
      id: 'status',
      label: t('status', { ns: NAMESPACES.STATUS }),
      cell: StatusColumn,
    },
    {
      id: 'action',
      label: '',
      cell: () => (
        <OdsButton
          label=""
          icon={ODS_ICON_NAME.trash}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={() => {
            // TODO: Next JIRA
          }}
        />
      ),
    },
  ];

  return (
    <Datagrid
      columns={columns}
      items={rules || []}
      totalItems={rules?.length}
      isLoading={isLoading}
      numberOfLoadingRows={5}
    />
  );
};
