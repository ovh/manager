import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

import { ManagerButton } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovh-ux/muk';

import { useDomains, usePlatform } from '@/data/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import {
  ADD_EMAIL_ACCOUNT,
  GUIDE_OVH_MAIL_MIGRATOR,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { EmailAccountsExportCsv } from './EmailAccountsExportCsv.component';

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
  const handleOvhMailMigratorAccountClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [GUIDE_OVH_MAIL_MIGRATOR],
    });
    window.open(GUIDES_LIST.ovh_mail_migrator.url.DEFAULT, '_blank');
  };

  return (
    <div className="flex gap-6">
      <Tooltip>
        <TooltipTrigger asChild>
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
              {t('zimbra_account_account_ad>d')}
            </>
          </Button>
        </TooltipTrigger>
        {canCreateAccount && (
          <TooltipContent withArrow>
            <Text preset={TEXT_PRESET.paragraph}>
              {t(
                domains?.length
                  ? 'zimbra_account_tooltip_need_slot'
                  : 'zimbra_account_tooltip_need_domain',
              )}
            </Text>
          </TooltipContent>
        )}
      </Tooltip>
      <ManagerButton
        id="order-account-btn"
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.create]}
        data-testid="order-account-btn"
        color={ODS_BUTTON_COLOR.primary}
        variant={ODS_BUTTON_VARIANT.outline}
        size={ODS_BUTTON_SIZE.sm}
        onClick={handleOrderEmailAccountClick}
        label={t('zimbra_account_account_order')}
      />
      <ManagerButton
        id="ovh-mail-migrator-btn"
        color={ODS_BUTTON_COLOR.primary}
        variant={ODS_BUTTON_VARIANT.outline}
        size={ODS_BUTTON_SIZE.sm}
        onClick={handleOvhMailMigratorAccountClick}
        label={t('zimbra_account_account_migrate')}
        iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
        icon={ODS_ICON_NAME.externalLink}
      />
      <EmailAccountsExportCsv />
    </div>
  );
};

export default DatagridTopbar;
