import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ManagerButton } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useDomains, useOrganization, usePlatform } from '@/data/hooks';
import { useGenerateUrl } from '@/hooks';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';
import {
  ADD_EMAIL_ACCOUNT,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constants';
import { AccountStatistics } from '@/data/api';

export const DatagridTopbar = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { data: platform, platformUrn } = usePlatform();
  const { data: organisation } = useOrganization();

  const hrefAddEmailAccount = useGenerateUrl('./add', 'path');
  const hrefOrderEmailAccount = useGenerateUrl('./order', 'path');

  const { data: domains, isLoading: isLoadingDomains } = useDomains();

  const accountsStatistics: AccountStatistics[] = useMemo(() => {
    return organisation
      ? organisation.currentState?.accountsStatistics
      : platform?.currentState?.accountsStatistics;
  }, [organisation, platform]);

  const hasAvailableAccounts = useMemo(() => {
    return accountsStatistics
      ?.map((stats) => {
        return stats.availableAccountsCount > 0;
      })
      .some(Boolean);
  }, [accountsStatistics, platform, organisation]);

  const canCreateAccount =
    !isLoadingDomains && !!domains?.length && hasAvailableAccounts;

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
