import React from 'react';
import {
  OdsText,
  OdsSelect,
  OdsCheckbox,
  OdsIcon,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { IpEdgeFirewallProtocol, IpEdgeFirewallRule } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { TRANSLATION_NAMESPACES } from '@/utils';

const validOptions = ['none', 'established', 'syn'];

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
    <div className="flex flex-col gap-2">
      {rule?.isNew && newProtocol === IpEdgeFirewallProtocol.TCP ? (
        <>
          <OdsSelect
            className="block min-w-[130px]"
            name="action-select"
            value={newTcpOption || 'none'}
            onOdsChange={(e) => {
              const newValue = e.detail.value as 'established' | 'syn' | 'none';
              setNewTcpOption(newValue === 'none' ? null : newValue);
            }}
          >
            {validOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'none'
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
              className="text-[var(--ods-color-text)] cursor-pointer ml-2"
            />
            <OdsTooltip triggerId="fragments-tooltip" withArrow>
              <OdsText>{t('fragments_tooltip')}</OdsText>
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
