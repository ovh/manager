import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_LINK_ICON_ALIGNMENT,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsLink, OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ManagerButton, useBytes, useNotifications } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { AccountType } from '@/data/api';
import {
  SlotWithService,
  useAccounts,
  useDomains,
  usePlatform,
  useSlotsWithService,
} from '@/data/hooks';
import { useAccountsStatistics, useGenerateUrl } from '@/hooks';
import {
  ADD_EMAIL_ACCOUNT,
  EXPORT_CSV_ACCOUNT,
  ORDER_ZIMBRA_EMAIL_ACCOUNT,
} from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

export const DatagridTopbar = () => {
  const { t } = useTranslation([
    'accounts',
    'common',
    NAMESPACES.BILLING,
    NAMESPACES.FORM,
    NAMESPACES.DASHBOARD,
  ]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  const { formatBytes } = useBytes();
  const { platformUrn } = usePlatform();
  const { accountsStatistics } = useAccountsStatistics();
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [isCSVLoaded, setIsCSVLoaded] = useState(false);
  const { addSuccess } = useNotifications();

  const hrefAddEmailAccount = useGenerateUrl('./add', 'path');
  const hrefOrderEmailAccount = useGenerateUrl('./order', 'path');

  const { data: domains, isLoading: isLoadingDomains } = useDomains();

  const {
    data: accounts,
    fetchAllPages: fetchAllPagesAccounts,
    hasNextPage: hasNextPageAccounts,
    isLoading: isLoadingAccounts,
    isFetchingNextPage: isFetchingNextPageAccounts,
  } = useAccounts({
    enabled: isCSVLoading,
  });

  const {
    slots,
    fetchAllPages: fetchAllPagesSlots,
    hasNextPage: hasNextPageSlots,
    isLoadingSlots,
    isFetchingNextPage: isFetchingNextPageSlots,
  } = useSlotsWithService({
    enabled: isCSVLoading,
  });

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

  interface ExportColumn {
    id: string;
    label: string;
    getValue: (item: ItemCSV) => string;
  }

  type ItemCSV = {
    account?: AccountType;
    slot: SlotWithService;
  };

  const handleExportWithExportToCsv = useCallback(() => {
    const items: ItemCSV[] = slots
      .map((slot) => {
        return {
          account: accounts.find((account) => account.currentState.slotId === slot.id),
          slot: slot,
        };
      })
      .sort((a: ItemCSV, b: ItemCSV) => {
        const organizationLabelA = a.account?.currentState?.organizationLabel;
        const organizationLabelB = b.account?.currentState?.organizationLabel;
        if (organizationLabelA === undefined) {
          return 1;
        }
        if (organizationLabelB === undefined) {
          return -1;
        }
        return organizationLabelA.localeCompare(organizationLabelB);
      });

    const exportColumns: ExportColumn[] = [
      {
        id: 'slotId',
        label: 'slotId',
        getValue: (item) => item?.slot.id,
      },
      {
        id: 'offer',
        label: t('common:offer'),
        getValue: (item) => item?.slot.offer,
      },
      {
        id: 'price',
        label: t(`${NAMESPACES.FORM}:price`),
        getValue: (item) => item?.slot.service.price,
      },
      {
        id: 'state',
        label: t('zimbra_account_datagrid_renewal_type'),
        getValue: (item) =>
          t(`common:service_billing_state_${item?.slot.service.state.toLowerCase()}`),
      },
      {
        id: 'nextBillingDate',
        label: t(`${NAMESPACES.DASHBOARD}:renew_date`),
        getValue: (item) => item?.slot.service.nextBillingDate,
      },
      {
        id: 'email',
        label: t('common:email_account'),
        getValue: (item) => item?.account?.currentState?.email || '',
      },
      {
        id: 'status',
        label: t(`${NAMESPACES.STATUS}:status`),
        getValue: (item) => {
          if (item?.account?.currentState?.detailedStatus?.length > 0) {
            return item?.account?.currentState?.detailedStatus
              ?.map(({ status }) => t(`common:service_state_${status.toLowerCase()}`))
              .join(', ');
          }
          return item?.account?.resourceStatus
            ? t(`common:service_state_${item?.account?.resourceStatus.toLowerCase()}`)
            : '';
        },
      },
      {
        id: 'displayName',
        label: t(`${NAMESPACES.DASHBOARD}:display_name`),
        getValue: (item) => item?.account?.currentState?.displayName || '',
      },
      {
        id: 'firstName',
        label: t(`${NAMESPACES.FORM}:firstname`),
        getValue: (item) => item?.account?.currentState?.firstName || '',
      },
      {
        id: 'lastName',
        label: t(`${NAMESPACES.FORM}:lastname`),
        getValue: (item) => item?.account?.currentState?.lastName || '',
      },
      {
        id: 'organizationLabel',
        label: t('common:organization'),
        getValue: (item) => item?.account?.currentState?.organizationLabel || '',
      },
      {
        id: 'createdAt',
        label: t(`${NAMESPACES.DASHBOARD}:creation_date`),
        getValue: (item) => item?.account?.currentState?.createdAt || '',
      },
      {
        id: 'hideInGal',
        label: t('common:hide_in_gal'),
        getValue: (item) =>
          typeof item?.account?.currentState?.hideInGal === 'boolean'
            ? t(`${NAMESPACES.FORM}:${item?.account?.currentState?.hideInGal ? 'yes' : 'no'}`)
            : '',
      },
      {
        id: 'lastConnectionAt',
        label: t(`common:last_connection`),
        getValue: (item) => item?.account?.currentState?.lastConnectionAt || '',
      },
      {
        id: 'quotaUsed',
        label: t('common:quota_used'),
        getValue: (item) => formatBytes(item?.account?.currentState?.quota.used, 2, 1024) || '',
      },
      {
        id: 'quotaAvailable',
        label: t('common:quota_available'),
        getValue: (item) =>
          formatBytes(item?.account?.currentState?.quota.available, 2, 1024) || '',
      },
      {
        id: 'profession',
        label: t(`common:contactInformation_profession`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.profession || '',
      },
      {
        id: 'office',
        label: t(`common:contactInformation_office`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.office || '',
      },
      {
        id: 'service',
        label: t(`common:contactInformation_service`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.service || '',
      },
      {
        id: 'company',
        label: t(`common:contactInformation_company`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.company || '',
      },
      {
        id: 'mobileNumber',
        label: t(`common:contactInformation_mobileNumber`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.mobileNumber || '',
      },
      {
        id: 'phoneNumber',
        label: t(`common:contactInformation_phoneNumber`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.phoneNumber || '',
      },
      {
        id: 'faxNumber',
        label: t(`common:contactInformation_faxNumber`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.faxNumber || '',
      },
      {
        id: 'street',
        label: t(`common:contactInformation_street`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.street || '',
      },
      {
        id: 'postcode',
        label: t(`common:contactInformation_postcode`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.postcode || '',
      },
      {
        id: 'city',
        label: t(`common:contactInformation_city`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.city || '',
      },
      {
        id: 'country',
        label: t(`common:contactInformation_country`),
        getValue: (item) => item?.account?.currentState?.contactInformation?.country || '',
      },
    ];

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'navigation',
      actions: [EXPORT_CSV_ACCOUNT],
    });
    const csvConfig = mkConfig({
      filename: 'zimbra_accounts',
      fieldSeparator: ',',
      quoteStrings: true,
      useKeysAsHeaders: true,
    });

    const csvData = items.map((item) =>
      exportColumns.reduce(
        (acc, column) => ({
          ...acc,
          [column.label]: column.getValue(item),
        }),
        {},
      ),
    );

    const csv = generateCsv(csvConfig)(csvData);
    const csvString = csv as unknown as string;
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const successMessage = (
      <div>
        {t('common:export_success')}

        <OdsLink
          href={url}
          download={csvConfig.filename}
          label={t('common:export_download_manually')}
          className="ml-4"
          icon={ODS_ICON_NAME.download}
          iconAlignment={ODS_LINK_ICON_ALIGNMENT.right}
        />
      </div>
    );
    addSuccess(successMessage);
    download(csvConfig)(csv);
    setIsCSVLoading(false);
  }, [accounts, slots, addSuccess]);

  const handleExportAllWithExportToCsv = () => {
    fetchAllPagesAccounts();
    fetchAllPagesSlots();
    setIsCSVLoading(true);
  };

  useEffect(() => {
    if (
      accounts?.length > 0 &&
      slots?.length > 0 &&
      !hasNextPageAccounts &&
      !isLoadingAccounts &&
      !isFetchingNextPageAccounts &&
      !hasNextPageSlots &&
      !isLoadingSlots &&
      !isFetchingNextPageSlots
    ) {
      setIsCSVLoaded(true);
    }
    if (isCSVLoaded && isCSVLoading) {
      handleExportWithExportToCsv();
    }
  }, [
    accounts,
    slots,
    isCSVLoading,
    isCSVLoaded,
    hasNextPageAccounts,
    isLoadingAccounts,
    isFetchingNextPageAccounts,
    hasNextPageSlots,
    isLoadingSlots,
    isFetchingNextPageSlots,
    handleExportWithExportToCsv,
  ]);

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
      <ManagerButton
        id="export-csv"
        color={ODS_BUTTON_COLOR.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.outline}
        urn={platformUrn}
        iamActions={[IAM_ACTIONS.account.create]}
        isLoading={isCSVLoading}
        onClick={handleExportAllWithExportToCsv}
        data-testid="export-csv"
        icon={ODS_ICON_NAME.download}
        label={t(`${NAMESPACES.ACTIONS}:export_as`, { format: 'CSV' })}
        isDisabled={isCSVLoading}
        iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
      />
    </div>
  );
};

export default DatagridTopbar;
