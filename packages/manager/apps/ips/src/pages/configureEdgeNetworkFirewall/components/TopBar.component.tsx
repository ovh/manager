import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsButton,
  OdsIcon,
  OdsSpinner,
  OdsText,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpEdgeFirewallStateEnum } from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { useGetIpMitigation } from '@/data/hooks';

function getToggleLabelFromFirewallState({
  state,
  enabled,
}: {
  state: IpEdgeFirewallStateEnum;
  enabled: boolean;
}) {
  if (state === IpEdgeFirewallStateEnum.PENDING_ENABLE) {
    return 'activation_in_progress';
  }
  if (state === IpEdgeFirewallStateEnum.PENDING_DISABLE) {
    return 'suspending';
  }
  return enabled ? 'ok' : 'disabled';
}

export const TopBar: React.FC = () => {
  const {
    ipOnFirewall,
    showEnableFirewallModal,
    showNewRuleRow,
    isLoading,
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
  const {
    ipMitigation,
    isLoading: isIpMitigationLoading,
  } = useGetIpMitigation({ ip: ipOnFirewall });

  return (
    <div className="flex w-full flex-col sm:flex-row justify-between mb-2 gap-2">
      <div className="flex items-center gap-2">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          label={`${t('add', { ns: NAMESPACES.ACTIONS })} ${t('oneRule')}`}
          isDisabled={
            isLoading ||
            isRulesLoading ||
            maxRulesReached ||
            isIpMitigationLoading ||
            ipMitigation?.length > 0
          }
          onClick={showNewRuleRow}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
        />
        {maxRulesReached && (
          <>
            <OdsIcon
              id="tooltip-add-rule"
              name={ODS_ICON_NAME.circleQuestion}
              tabIndex={0}
              className="text-[var(--ods-color-text)] cursor-pointer"
            />
            <OdsTooltip triggerId="tooltip-add-rule" withArrow>
              <OdsText>{t('max_rules_reached_tooltip')}</OdsText>
            </OdsTooltip>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <OdsText>
          {t(
            getToggleLabelFromFirewallState({
              enabled: firewallModeEnabled,
              state: firewallState,
            }),
            {
              ns: NAMESPACES.STATUS,
            },
          )}
        </OdsText>
        {[
          IpEdgeFirewallStateEnum.PENDING_DISABLE,
          IpEdgeFirewallStateEnum.PENDING_ENABLE,
        ].includes(firewallState) && <OdsSpinner size={ODS_SPINNER_SIZE.xs} />}
        <OdsIcon
          id="tooltip"
          name={ODS_ICON_NAME.circleQuestion}
          tabIndex={0}
          className="text-[var(--ods-color-text)] cursor-pointer"
        />
        <OdsTooltip triggerId="tooltip" withArrow>
          <OdsText>
            {hasNoFirewall
              ? t('firewall_not_created_tooltip')
              : t(
                  ipMitigation?.length > 0
                    ? 'mitigation_mode_active_warning_tooltip'
                    : 'enable_firewall_tooltip',
                )}
          </OdsText>
        </OdsTooltip>
        <OdsToggle
          name="enable-edge-firewall"
          value={tmpToggleState ?? firewallModeEnabled}
          isDisabled={
            isLoading ||
            isRulesLoading ||
            firewallState !== IpEdgeFirewallStateEnum.OK
          }
          onClick={(event) => {
            event.preventDefault();
            setTmpToggleState(!event?.currentTarget?.value);
            showEnableFirewallModal();
          }}
        />
      </div>
    </div>
  );
};
