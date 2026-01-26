import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { IpEdgeFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

const validActions = ['deny', 'permit'];

export const ModeColumn = (rule: IpEdgeFirewallRule & { isNew?: boolean }) => {
  const { newMode, setNewMode, modeError, setModeError } = React.useContext(
    EdgeNetworkFirewallContext,
  );
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);

  return rule?.isNew ? (
    <FormField className="min-w-[90px]" invalid={!!modeError}>
      <Select
        className="block"
        name="action-select"
        value={[newMode]}
        invalid={!!modeError}
        onValueChange={(e) => {
          setNewMode(e.value?.[0] as 'deny' | 'permit');
          setModeError(undefined);
        }}
        items={validActions.map((action) => ({
          label: t(`${action}_action`),
          value: action,
        }))}
      >
        <SelectContent />
        <SelectControl />
      </Select>
      <FormFieldError>{modeError}</FormFieldError>
    </FormField>
  ) : (
    <Text>{t(`${rule?.action}_action`)}</Text>
  );
};
