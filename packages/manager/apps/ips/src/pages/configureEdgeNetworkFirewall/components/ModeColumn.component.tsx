import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';

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
    <OdsFormField className="min-w-[90px]" error={modeError}>
      <OdsSelect
        className="block"
        name="action-select"
        value={newMode}
        hasError={!!modeError}
        onOdsChange={(e) => {
          setNewMode(e.detail.value as 'deny' | 'permit');
          setModeError(undefined);
        }}
      >
        {validActions.map((action) => (
          <option key={action} value={action}>
            {t(`${action}_action`)}
          </option>
        ))}
      </OdsSelect>
    </OdsFormField>
  ) : (
    <OdsText>{t(`${rule?.action}_action`)}</OdsText>
  );
};
