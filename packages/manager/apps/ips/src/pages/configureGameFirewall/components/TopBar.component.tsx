import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  Button,
  Text,
  Toggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ToggleControl,
} from '@ovhcloud/ods-react';

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
    loading,
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
    <div className="mb-5 flex w-full flex-col justify-between gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
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
          <Icon className="mr-2" name={ICON_NAME.plus} />
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
        <Text>{t('apply_deny_strategy_switch_label')}</Text>
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon
              name={ICON_NAME.circleQuestion}
              className="cursor-pointer text-[var(--ods-color-text)]"
            />
          </TooltipTrigger>
          <TooltipContent withArrow>
            {t('deny_strategy_tooltip')}
          </TooltipContent>
        </Tooltip>
        <Toggle
          name="strategy-default-deny"
          checked={tmpToggleState ?? firewallModeEnabled}
          disabled={
            loading ||
            isRulesLoading ||
            gameFirewallState !== IpGameFirewallStateEnum.OK
          }
          onCheckedChange={(event) => {
            setTmpToggleState(event?.checked);
            showStrategyConfirmationModal();
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
