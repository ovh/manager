import { useContext, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { ExportCsv } from '@/components';
import { useDomains, usePlatform } from '@/data/hooks';
import { GUIDES_LIST } from '@/guides.constants';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import {
  ADD_EMAIL_ACCOUNT,
  GUIDE_OVH_MAIL_MIGRATOR,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

import { EmailAccountItem } from './EmailAccounts.types';

export type DatagridTopbarProps = {
  selectedRows?: EmailAccountItem[];
};

export const DatagridTopbar: React.FC<DatagridTopbarProps> = ({
  selectedRows,
}: DatagridTopbarProps) => {
  const { t } = useTranslation(['accounts', 'common', NAMESPACES.ACTIONS]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const context = useContext(ShellContext);

  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();

  const { data: domains, isLoading: isLoadingDomains } = useDomains();
  const { ovhSubsidiary } = context.environment.getUser();

  const hrefAddEmailAccount = useGenerateUrl('./add', 'path');
  const hrefOrderEmailAccount = useGenerateUrl('./order', 'path');
  const hrefDeleteSelectedEmailAccounts = useGenerateUrl('./delete_all', 'path');

  const hrefEmailMigratorUrl = () =>
    GUIDES_LIST.ovh_mail_migrator.url?.[ovhSubsidiary] || GUIDES_LIST.ovh_mail_migrator.url.DEFAULT;

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
    window.open(hrefEmailMigratorUrl(), '_blank');
  };
  const handleSelectEmailAccounts = () => {
    navigate(hrefDeleteSelectedEmailAccounts, {
      state: {
        selectedEmailAccounts: selectedRows.map((row) => ({
          id: row?.id,
          email: row?.email,
        })),
      },
    });
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
              {t(`${NAMESPACES.ACTIONS}:configure`)}
            </>
          </Button>
        </TooltipTrigger>
        {!canCreateAccount && (
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
      <Button
        id="order-account-btn"
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.create]}
        data-testid="order-account-btn"
        color={BUTTON_COLOR.primary}
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.sm}
        onClick={handleOrderEmailAccountClick}
      >
        <>
          <Icon name={ICON_NAME.shoppingCart} />
          {t(`${NAMESPACES.ACTIONS}:order`)}
        </>
      </Button>
      <Button
        id="ovh-mail-migrator-btn"
        color={BUTTON_COLOR.primary}
        variant={BUTTON_VARIANT.outline}
        size={BUTTON_SIZE.sm}
        onClick={handleOvhMailMigratorAccountClick}
      >
        <>
          {t(`${NAMESPACES.ACTIONS}:migrate`)}
          <Icon name={ICON_NAME.externalLink} />
        </>
      </Button>
      <ExportCsv />
      {!!selectedRows?.length && (
        <Button
          id="ovh-mail-delete-selected-btn"
          color={BUTTON_COLOR.critical}
          size={BUTTON_SIZE.sm}
          onClick={handleSelectEmailAccounts}
        >
          <>
            {t('zimbra_account_delete_all', { count: selectedRows.length })}
            <Icon name={ICON_NAME.trash} />
          </>
        </Button>
      )}
    </div>
  );
};

export default DatagridTopbar;
