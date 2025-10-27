import React from 'react';
import { OdsText, OdsInput } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { IpEdgeFirewallRule } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { handleEnterAndEscapeKeyDown, TRANSLATION_NAMESPACES } from '@/utils';

export const SourceColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newSource,
    setNewSource,
    createNewRule,
    hideNewRuleRow,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);

  return rule?.isNew ? (
    <OdsInput
      className="w-full"
      name="source-input"
      value={newSource}
      onOdsChange={(e) => setNewSource(e.detail.value as string)}
      onKeyDown={handleEnterAndEscapeKeyDown({
        onEnter: createNewRule,
        onEscape: hideNewRuleRow,
      })}
    />
  ) : (
    <OdsText>{rule?.source === 'any' ? t('any_source') : rule?.source}</OdsText>
  );
};
