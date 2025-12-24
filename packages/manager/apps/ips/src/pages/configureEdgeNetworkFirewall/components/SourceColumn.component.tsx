import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

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
    <OdsFormField error={sourceError}>
      <OdsInput
        className="w-full"
        name="source-input"
        value={newSource}
        hasError={!!sourceError}
        onOdsChange={(e) => {
          setNewSource(e.detail.value as string);
          setSourceError(undefined);
        }}
        onKeyDown={handleEnterAndEscapeKeyDown({
          onEnter: createNewRule,
          onEscape: hideNewRuleRow,
        })}
      />
    </OdsFormField>
  ) : (
    <OdsText>{rule?.source === 'any' ? t('any_source') : rule?.source}</OdsText>
  );
};
