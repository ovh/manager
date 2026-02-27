import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Icon,
  Text,
  Toggle,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  ToggleControl,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpEdgeFirewallStateEnum } from '@/data/api';
import { useGetIpMitigation } from '@/data/hooks';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

function getToggleLabelFromFirewallState({
  state,
  enabled,
}: {
  state: IpEdgeFirewallStateEnum;
  enabled: boolean;
}) {
  if (state === IpEdgeFirewallStateEnum.PENDING_ENABLE) {
    return 'ok';
  }
  if (state === IpEdgeFirewallStateEnum.PENDING_DISABLE) {
    return 'disabled';
  }
  return enabled ? 'ok' : 'disabled';
}

export const TopBar: React.FC = () => {
  const {
    ipOnFirewall,
    showEnableFirewallModal,
    showNewRuleRow,
    loading,
    isRulesLoading,
    hasNoFirewall,
    firewallState,
    maxRulesReached,
    firewallModeEnabled,
    tmpToggleState,
    setTmpToggleState,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.ACTIONS,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.listing,
    TRANSLATION_NAMESPACES.error,
  ]);
  const { ipMitigation, loading: isIpMitigationLoading } = useGetIpMitigation({
    ip: ipOnFirewall,
    enabled: !!ipOnFirewall,
  });
  const { trackClick } = useOvhTracking();

  return (
    <div className="my-5 flex w-full flex-col justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <Button
          variant={BUTTON_VARIANT.outline}
          disabled={loading || isRulesLoading || maxRulesReached}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['add_rule'],
            });
            showNewRuleRow();
          }}
          size={BUTTON_SIZE.sm}
        >
          <Icon name={ICON_NAME.plus} className="mr-2" />
          {`${t('add', { ns: NAMESPACES.ACTIONS })} ${t('oneRule')}`}
        </Button>
        {maxRulesReached && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Icon
                name={ICON_NAME.circleQuestion}
                className="cursor-pointer text-[var(--ods-color-text)]"
              />
            </TooltipTrigger>
            <TooltipContent withArrow>
              {t('max_rules_reached_tooltip')}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Text>
          {t(
            getToggleLabelFromFirewallState({
              enabled: firewallModeEnabled,
              state: firewallState,
            }),
            {
              ns: NAMESPACES.STATUS,
            },
          )}
        </Text>
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon
              name={ICON_NAME.circleQuestion}
              tabIndex={0}
              className="cursor-pointer text-[var(--ods-color-text)]"
            />
          </TooltipTrigger>
          <TooltipContent withArrow>
            {hasNoFirewall
              ? t('firewall_not_created_tooltip')
              : t(
                  ipMitigation?.length > 0
                    ? 'mitigation_mode_active_warning_tooltip'
                    : 'enable_firewall_tooltip',
                )}
          </TooltipContent>
        </Tooltip>
        <Toggle
          name="enable-edge-firewall"
          checked={tmpToggleState ?? firewallModeEnabled}
          disabled={
            loading ||
            isRulesLoading ||
            firewallState !== IpEdgeFirewallStateEnum.OK ||
            hasNoFirewall ||
            isIpMitigationLoading ||
            ipMitigation?.length > 0
          }
          onCheckedChange={(event) => {
            console.log('Toggle changed:', event);
            setTmpToggleState(event?.checked);
            showEnableFirewallModal();
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['apply_default-refusal-strategy'],
            });
          }}
        >
          <ToggleControl />
        </Toggle>
      </div>
    </div>
  );
};
