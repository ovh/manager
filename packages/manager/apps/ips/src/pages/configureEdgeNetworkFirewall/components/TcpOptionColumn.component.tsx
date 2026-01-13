import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsCheckbox,
  OdsIcon,
  OdsSelect,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { IpEdgeFirewallProtocol, IpEdgeFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

enum TcpOptions {
  none = 'none',
  established = 'established',
  syn = 'syn',
}

export const TcpOptionColumn = (
  rule: IpEdgeFirewallRule & { isNew?: boolean },
) => {
  const {
    newTcpOption,
    setNewTcpOption,
    newFragments,
    setNewFragments,
    newProtocol,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation(TRANSLATION_NAMESPACES.edgeNetworkFirewall);

  return (
    <div className="flex flex-col gap-4">
      {rule?.isNew && newProtocol === IpEdgeFirewallProtocol.TCP ? (
        <>
          <OdsSelect
            className="block min-w-[130px]"
            name="action-select"
            value={newTcpOption || TcpOptions.none}
            onOdsChange={(e) => {
              const newValue = e.detail.value as TcpOptions;
              setNewTcpOption(
                newValue === TcpOptions.none ? undefined : newValue,
              );
            }}
          >
            {Object.values(TcpOptions).map((option) => (
              <option key={option} value={option}>
                {option === TcpOptions.none
                  ? t(`${option}_label`)
                  : option?.toUpperCase()}
              </option>
            ))}
          </OdsSelect>
          <div className="flex items-center">
            <OdsCheckbox
              isChecked={newFragments}
              onOdsChange={(e) => setNewFragments(e.detail.checked)}
              className="mr-3"
              inputId="fragments"
              name="fragments"
            />
            <label htmlFor="fragments" slot="label">
              {t('fragments_label')}
            </label>
            <OdsIcon
              id="fragments-tooltip"
              name={ODS_ICON_NAME.circleQuestion}
              tabIndex={0}
              className="ml-2 cursor-pointer text-[var(--ods-color-text)]"
            />
            <OdsTooltip triggerId="fragments-tooltip" withArrow>
              <OdsText className="p-2">{t('fragments_tooltip')}</OdsText>
            </OdsTooltip>
          </div>
        </>
      ) : (
        <>
          {rule?.fragments && <OdsText>{t('fragments_label')}</OdsText>}
          {rule?.tcpOption && <OdsText>{rule.tcpOption}</OdsText>}
        </>
      )}
    </div>
  );
};
