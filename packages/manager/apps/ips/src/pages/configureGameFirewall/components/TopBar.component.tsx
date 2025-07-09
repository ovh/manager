import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsButton,
  OdsIcon,
  OdsText,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { IpGameFirewallStateEnum } from '@/data/api';
import { GameFirewallContext } from '../gamefirewall.context';

export const TopBar: React.FC = () => {
  const {
    showStrategyConfirmationModal,
    showNewRuleRow,
    isLoading,
    isRulesLoading,
    gameFirewallState,
    maxRulesReached,
    firewallModeEnabled,
    tmpToggleState,
    setTmpToggleState,
  } = React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.listing,
    TRANSLATION_NAMESPACES.error,
  ]);
  return (
    <div className="flex w-full flex-col sm:flex-row justify-between mb-2 gap-2">
      <div className="flex items-center gap-2">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          label={`${t('add', { ns: NAMESPACES.ACTIONS })} ${t('oneRule')}`}
          isDisabled={isLoading || isRulesLoading || maxRulesReached}
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
        <OdsText>{t('apply_deny_strategy_switch_label')}</OdsText>
        <OdsIcon
          id="tooltip"
          name={ODS_ICON_NAME.circleQuestion}
          tabIndex={0}
          className="text-[var(--ods-color-text)] cursor-pointer"
        />
        <OdsTooltip triggerId="tooltip" withArrow>
          <OdsText>{t('deny_strategy_tooltip')}</OdsText>
        </OdsTooltip>
        <OdsToggle
          name="strategy-default-deny"
          value={tmpToggleState ?? firewallModeEnabled}
          isDisabled={
            isLoading ||
            isRulesLoading ||
            gameFirewallState !== IpGameFirewallStateEnum.OK
          }
          onClick={(event) => {
            event.preventDefault();
            setTmpToggleState(!event?.currentTarget?.value);
            showStrategyConfirmationModal();
          }}
        />
      </div>
    </div>
  );
};
