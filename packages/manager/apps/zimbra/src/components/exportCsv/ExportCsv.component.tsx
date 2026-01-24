import { useCallback, useEffect, useMemo, useState } from 'react';

import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  ICON_NAME,
  Icon,
  Link,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Button, useBytes, useNotifications } from '@ovh-ux/muk';

import { AccountType } from '@/data/api';
import { SlotWithService, useAccounts, usePlatform, useSlotsWithService } from '@/data/hooks';
import { EXPORT_CSV_ACCOUNT } from '@/tracking.constants';
import { IAM_ACTIONS } from '@/utils/iamAction.constants';

interface ExportColumn {
  id: string;
  label: string;
  getValue: (item: ItemCSV) => string;
}

type ItemCSV = {
  account?: AccountType;
  slot: SlotWithService;
};

export const ExportCsv = () => {
  const { t } = useTranslation([
    'accounts',
    'common',
    NAMESPACES.BILLING,
    NAMESPACES.FORM,
    NAMESPACES.DASHBOARD,
  ]);
  const { platformUrn } = usePlatform();
  const { trackClick } = useOvhTracking();
  const { formatBytes } = useBytes();
  const [isCSVLoading, setIsCSVLoading] = useState(false);
  const [isCSVLoaded, setIsCSVLoaded] = useState(false);
  const { addSuccess, addError } = useNotifications();

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

  const exportColumns: ExportColumn[] = useMemo(
    () => [
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
              ?.map(({ status }) => t(`common:account_state_tooltip_${status.toLowerCase()}`))
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
    ],
    [formatBytes, t],
  );

  const handleExportWithExportToCsv = useCallback(() => {
    const items: ItemCSV[] = slots
      .map((slot) => {
        return {
          account: accounts.find((account) => account.currentState.slotId === slot.id),
          slot,
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

    try {
      const csv = generateCsv(csvConfig)(csvData);
      const csvString = csv as unknown as string;
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);

      const successMessage = (
        <div>
          {t('common:export_success')}

          <Link href={url} download={csvConfig.filename} className="ml-4">
            {t('common:export_download_manually')}
            <Icon name={ICON_NAME.download} />
          </Link>
        </div>
      );
      addSuccess(successMessage);
      download(csvConfig)(csv);
      setIsCSVLoading(false);
    } catch (err) {
      addError(
        <Text preset={TEXT_PRESET.paragraph}>
          {t('common:export_error', {
            error: err,
          })}
        </Text>,
        true,
      );
    }
  }, [accounts, slots, addSuccess, addError, t]);

  const handleExportAllWithExportToCsv = () => {
    fetchAllPagesAccounts();
    fetchAllPagesSlots();
    setIsCSVLoading(true);
  };

  useEffect(() => {
    if (accounts?.length > 0 && slots?.length > 0 && !isLoadingAccounts && !isLoadingSlots) {
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
    <Button
      id="export-csv"
      color={BUTTON_COLOR.primary}
      size={BUTTON_SIZE.sm}
      variant={BUTTON_VARIANT.outline}
      urn={platformUrn}
      iamActions={[IAM_ACTIONS.account.get, IAM_ACTIONS.slot.get]}
      loading={isCSVLoading}
      onClick={handleExportAllWithExportToCsv}
      data-testid="export-csv"
      disabled={isCSVLoading}
    >
      <>
        {t(`${NAMESPACES.ACTIONS}:export_as`, { format: 'CSV' })}
        <Icon name={ICON_NAME.download} />
      </>
    </Button>
  );
};
