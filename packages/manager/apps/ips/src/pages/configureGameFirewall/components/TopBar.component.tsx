import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsIcon,
  OdsText,
  OdsToggle,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { IpGameFirewallStateEnum } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

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
  const { trackClick } = useOvhTracking();

  return (
    <div className="my-5 flex w-full flex-col justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-4">
        <OdsButton
          variant={ODS_BUTTON_VARIANT.outline}
          label={`${t('add', { ns: NAMESPACES.ACTIONS })} ${t('oneRule')}`}
          isDisabled={isLoading || isRulesLoading || maxRulesReached}
          onClick={() => {
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['add_rule'],
            });
            showNewRuleRow();
          }}
          icon={ODS_ICON_NAME.plus}
          size={ODS_BUTTON_SIZE.sm}
        />
        {maxRulesReached && (
          <>
            <OdsIcon
              id="tooltip-add-rule"
              name={ODS_ICON_NAME.circleQuestion}
              tabIndex={0}
              className="cursor-pointer text-[var(--ods-color-text)]"
            />
            <OdsTooltip triggerId="tooltip-add-rule" withArrow>
              <OdsText className="p-2">
                {t('max_rules_reached_tooltip')}
              </OdsText>
            </OdsTooltip>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <OdsText>{t('apply_deny_strategy_switch_label')}</OdsText>
        <OdsIcon
          id="tooltip"
          name={ODS_ICON_NAME.circleQuestion}
          tabIndex={0}
          className="cursor-pointer text-[var(--ods-color-text)]"
        />
        <OdsTooltip triggerId="tooltip" withArrow>
          <OdsText className="p-2">{t('deny_strategy_tooltip')}</OdsText>
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
            trackClick({
              location: PageLocation.page,
              buttonType: ButtonType.button,
              actionType: 'action',
              actions: ['apply_default-refusal-strategy'],
            });
          }}
        />
      </div>
    </div>
  );
};
