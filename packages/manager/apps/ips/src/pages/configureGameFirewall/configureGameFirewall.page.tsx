import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  BaseLayout,
  ErrorBanner,
  Modal,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
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
  ODS_MODAL_COLOR,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb/Breadcrumb';
import { useHeader } from '@/components/Header/Header';
import { urls } from '@/routes/routes.constant';
import {
  useIpGameFirewallRules,
  useGetIpGameFirewall,
  useUpdateIpGameFirewall,
} from '@/data/hooks';
import { fromIdToIp, ipFormatter } from '@/utils';
import { IpGameFirewallStateEnum } from '@/data/api';
import { RuleDatagrid } from './RuleDatagrid.component';

export default function ConfigureGameFirewall() {
  const { id } = useParams();
  const { ipGroup } = ipFormatter(fromIdToIp(id));
  const [
    isStrategyConfirmationModalVisible,
    setIsStrategyConfirmationModalVisible,
  ] = React.useState(false);
  // It's a state just to let the toggle animate when we try to change its value
  const [tmpToggleState, setTmpToggleState] = React.useState(null);
  const { t } = useTranslation([
    'game-firewall',
    NAMESPACES.ACTIONS,
    'listing',
    'error',
  ]);
  const header = useHeader(t('title'));
  const { addSuccess, addError } = useNotifications();
  const { isLoading, ipGameFirewall, isError, error } = useGetIpGameFirewall({
    ip: ipGroup,
  });
  const firewallModeEnabled = ipGameFirewall?.[0]?.firewallModeEnabled;
  const ipOnGame = ipGameFirewall?.[0]?.ipOnGame;
  const isGameFirewallState = ipGameFirewall?.[0]?.state;
  const navigate = useNavigate();
  const { error: rulesError, isError: isRulesError } = useIpGameFirewallRules({
    ip: ipGroup,
    ipOnGame,
  });

  const closeConfirmationModal = () => {
    setIsStrategyConfirmationModalVisible(false);
    setTmpToggleState(undefined);
  };

  const breadcrumbMapper = (_: BreadcrumbItem, index: number) =>
    index === 0
      ? {
          label: ipOnGame,
          // TODO: Add search params once they are implemented on listing page
          onClick: () => navigate(urls.listing),
        }
      : { label: t('title') };

  const {
    isPending: isUpdatePending,
    mutate: updateGameFirewall,
  } = useUpdateIpGameFirewall({
    ip: ipGroup,
    ipOnGame,
    onSuccess: (variables) => {
      addSuccess(
        variables.firewallModeEnabled
          ? t('default_deny_strategy_enabled_success_message')
          : t('default_deny_strategy_disabled_success_message'),
        true,
      );
    },
    onError: (err) => {
      addError(
        t('managerApiError', {
          ns: 'error',
          error: err?.response?.data?.message,
          ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
        }),
        true,
      );
    },
    onSettled: () => {
      setIsStrategyConfirmationModalVisible(false);
      setTmpToggleState(undefined);
    },
  });

  if (isError || isRulesError) {
    return (
      <ErrorBanner
        error={{
          ...(error || rulesError)?.response,
          data: error || rulesError,
        }}
      />
    );
  }

  return (
    <>
      <BaseLayout
        backLinkLabel={t('back_to', {
          ns: NAMESPACES.ACTIONS,
          value: t('title', { ns: 'listing' }),
        })}
        onClickReturn={() => navigate(urls.listing)}
        breadcrumb={<Breadcrumb mapper={breadcrumbMapper} />}
        header={{ ...header, changelogButton: null }}
        message={<Notifications />}
      >
        <OdsText className="block mb-3">{t('description')}</OdsText>
        <OdsText className="block mb-3">{t('subDescription')}</OdsText>
        <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
          <OdsButton
            variant={ODS_BUTTON_VARIANT.outline}
            label={`${t('add', { ns: NAMESPACES.ACTIONS })} ${t('oneRule')}`}
            isDisabled={
              isLoading || isGameFirewallState !== IpGameFirewallStateEnum.OK
            }
            onClick={() => {
              // TODO: Implement adding rule in another JIRA
            }}
            icon={ODS_ICON_NAME.plus}
            size={ODS_BUTTON_SIZE.sm}
          />
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
                isLoading || isGameFirewallState !== IpGameFirewallStateEnum.OK
              }
              onClick={(event) => {
                event.preventDefault();
                setTmpToggleState(!event?.currentTarget?.value);
                setIsStrategyConfirmationModalVisible(true);
              }}
            />
          </div>
        </div>
        <RuleDatagrid ip={ipGroup} ipOnGame={ipOnGame} />
      </BaseLayout>
      <Modal
        isOpen={isStrategyConfirmationModalVisible}
        onDismiss={closeConfirmationModal}
        heading={
          firewallModeEnabled
            ? t('disable_deny_strategy_modal_title')
            : t('enable_deny_strategy_modal_title')
        }
        type={ODS_MODAL_COLOR.neutral}
        primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
        onPrimaryButtonClick={() =>
          updateGameFirewall({ firewallModeEnabled: !firewallModeEnabled })
        }
        isPrimaryButtonLoading={isUpdatePending}
        secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
        isSecondaryButtonDisabled={isUpdatePending}
        onSecondaryButtonClick={closeConfirmationModal}
      >
        <OdsText>
          {ipGameFirewall?.[0]?.firewallModeEnabled
            ? t('disable_deny_strategy_modal_description')
            : t('enable_deny_strategy_modal_description')}
        </OdsText>
      </Modal>
    </>
  );
}
