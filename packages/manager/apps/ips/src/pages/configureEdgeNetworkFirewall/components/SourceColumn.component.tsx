import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormField, FormFieldError, Input, Text } from '@ovhcloud/ods-react';

import { IpEdgeFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES, handleEnterAndEscapeKeyDown } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const SourceColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newSource,
    setNewSource,
    createNewRule,
    hideNewRuleRow,
    sourceError,
    setSourceError,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);

  return rule?.isNew ? (
    <FormField>
      <Input
        className="w-full"
        name="source-input"
        value={newSource}
        invalid={!!sourceError}
        onChange={(e) => {
          setNewSource(e.target.value);
          setSourceError(undefined);
        }}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
      <FormFieldError>{sourceError}</FormFieldError>
    </FormField>
  ) : (
    <Text>{rule?.source === 'any' ? t('any_source') : rule?.source}</Text>
  );
};
