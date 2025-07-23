import React, { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useDomains, usePlatform } from '@/data/hooks';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT, ORDER_ZIMBRA_EMAIL_ACCOUNT } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export const DatagridTopbar = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();

  const hrefAddEmailAccount = useGenerateUrl('./add', 'path');
  const hrefOrderEmailAccount = useGenerateUrl('./order', 'path');

  const { data: domains, isLoading: isLoadingDomains } = useDomains();

  const hasAvailableAccounts = useMemo(() => {
    return accountsStatistics
      ?.map((stats) => {
        return stats.availableAccountsCount > 0;
      })
      .some(Boolean);
  }, [accountsStatistics]);

  const canCreateAccount = !isLoadingDomains && !!domains?.length && hasAvailableAccounts;

  const handleAddEmailAccountClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ADD_EMAIL_ACCOUNT],
    });
    navigate(hrefAddEmailAccount);
  };
  const handleOrderEmailAccountClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [ORDER_ZIMBRA_EMAIL_ACCOUNT],
    });
    navigate(hrefOrderEmailAccount);
  };

  return (
    <div className="flex gap-6">
      <div id="add-account-tooltip-trigger">
        <ManagerButton
          id="add-account-btn"
          color={ODS_BUTTON_COLOR.primary}
          size={ODS_BUTTON_SIZE.sm}
          urn={platformUrn}
          iamActions={[IAM_ACTIONS.account.create]}
          onClick={handleAddEmailAccountClick}
          data-testid="add-account-btn"
          icon={ODS_ICON_NAME.plus}
          label={t('zimbra_account_account_add')}
          isDisabled={!canCreateAccount}
        />
      </div>
      {!canCreateAccount && (
        <OdsTooltip triggerId="add-account-tooltip-trigger">
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(
              domains?.length
                ? 'zimbra_account_tooltip_need_slot'
                : 'zimbra_account_tooltip_need_domain',
            )}
          </OdsText>
        </OdsTooltip>
      )}
      <ManagerButton
        id="order-account-btn"
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.create]}
        data-testid="order-account-btn"
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.sm}
        onClick={handleOrderEmailAccountClick}
        label={t('zimbra_account_account_order')}
      />
    </div>
  );
};

export default DatagridTopbar;
