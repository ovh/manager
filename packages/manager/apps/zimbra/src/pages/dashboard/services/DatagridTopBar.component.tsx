import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_COLOR, BUTTON_SIZE, ICON_NAME, Icon } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { ExportCsv } from '@/components';
import { SlotWithService, useDomains, usePlatform } from '@/data/hooks';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import { ADD_EMAIL_ACCOUNT } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export type DatagridTopbarProps = {
  selectedRows?: SlotWithService[];
};

export const DatagridTopbar: React.FC<DatagridTopbarProps> = () => {
  const { t } = useTranslation(['accounts', 'common']);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();

  const { data: domains, isLoading: isLoadingDomains } = useDomains();

  const hrefAddEmailAccount = useGenerateUrl('../email_accounts/add', 'path');

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

  return (
    <div className="flex gap-6">
      <Button
        id="add-account-btn"
        color={BUTTON_COLOR.primary}
        size={BUTTON_SIZE.sm}
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.create]}
        onClick={handleAddEmailAccountClick}
        data-testid="add-account-btn"
        disabled={!canCreateAccount}
      >
        <>
          <Icon name={ICON_NAME.plus} />
          {t('zimbra_account_account_add')}
        </>
      </Button>
      <ExportCsv />
    </div>
  );
};

export default DatagridTopbar;
