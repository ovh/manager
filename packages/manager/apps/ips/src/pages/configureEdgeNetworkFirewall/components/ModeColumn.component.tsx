import React from 'react';
import { OdsText, OdsSelect } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { IpEdgeFirewallRule } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { TRANSLATION_NAMESPACES } from '@/utils';

const validActions = ['deny', 'permit'];

export const ModeColumn = (rule: IpEdgeFirewallRule & { isNew?: boolean }) => {
  const { newMode, setNewMode } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);

  return rule?.isNew ? (
    <OdsSelect
      className="block min-w-[90px]"
      name="action-select"
      value={newMode}
      onOdsChange={(e) => setNewMode(e.detail.value as 'deny' | 'permit')}
    >
      {validActions.map((action) => (
        <option key={action} value={action}>
          {t(`${action}_action`)}
        </option>
      ))}
    </OdsSelect>
  ) : (
    <OdsText>{t(`${rule?.action}_action`)}</OdsText>
  );
};
