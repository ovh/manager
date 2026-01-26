import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  CheckboxControl,
  CheckboxLabel,
  ICON_NAME,
  SelectContent,
  SelectControl,
  Checkbox,
  Icon,
  Select,
  Text,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@ovhcloud/ods-react';

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
          <Select
            className="block min-w-[130px]"
            name="action-select"
            value={[newTcpOption || TcpOptions.none]}
            onValueChange={(e) => {
              const newValue = e.value?.[0] as TcpOptions;
              setNewTcpOption(
                newValue === TcpOptions.none ? undefined : newValue,
              );
            }}
            items={Object.values(TcpOptions).map((option) => ({
              label:
                option === TcpOptions.none
                  ? t(`${option}_label`)
                  : option?.toUpperCase(),
              value: option,
            }))}
          >
            <SelectContent />
            <SelectControl />
          </Select>
          <div className="flex items-center">
            <Checkbox
              checked={newFragments}
              onCheckedChange={(e) => setNewFragments(e.checked as boolean)}
            >
              <CheckboxLabel>{t('fragments_label')}</CheckboxLabel>
              <CheckboxControl />
            </Checkbox>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon
                  name={ICON_NAME.circleQuestion}
                  className="ml-2 cursor-pointer text-[var(--ods-color-text)]"
                />
              </TooltipTrigger>
              <TooltipContent withArrow>
                {t('fragments_tooltip')}
              </TooltipContent>
            </Tooltip>
          </div>
        </>
      ) : (
        <>
          {rule?.fragments && <Text>{t('fragments_label')}</Text>}
          {rule?.tcpOption && <Text>{rule.tcpOption}</Text>}
        </>
      )}
    </div>
  );
};
