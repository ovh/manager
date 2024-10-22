import React, { lazy, Suspense, useContext, useMemo, useState } from 'react';
import {
  OsdsIcon,
  OsdsLink,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OdsHTMLAnchorElementRel,
  OdsHTMLAnchorElementTarget,
} from '@ovhcloud/ods-common-core';
import { Await } from 'react-router-dom';
import { useFetchHubBills } from '@/data/hooks/bills/useBills';
import { useFetchHubDebt } from '@/data/hooks/debt/useDebt';
import '@/pages/layout/BillingSummary.style.scss';
import { BILLING_SUMMARY_PERIODS_IN_MONTHS } from '@/pages/layout/layout.constants';
import { usePeriodFilter } from '@/hooks/periodFilter/usePeriodFilter';
import { usePriceFormat } from '@/hooks/priceFormat/usePriceFormat';

const TileError = lazy(() =>
  import('@/components/tile-error/TileError.component'),
);

export default function BillingSummary() {
  const { t } = useTranslation('hub/billing');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const { trackClick } = useOvhTracking();
  const [months, setMonths] = useState(1);

  const {
    isPending: areBillsLoading,
    data: bills,
    error: billsError,
    refetch,
  } = useFetchHubBills(months);
  const { isPending: isDebtLoading, data: debt } = useFetchHubDebt();

  const isLoading = areBillsLoading || isDebtLoading;

  const formattedPrice = usePriceFormat(bills?.total, bills?.currency?.code);
  const formattedDebtPrice = usePriceFormat(
    debt?.dueAmount?.value,
    debt?.dueAmount?.currencyCode,
  );

  const payDebtLink = useMemo(
    () => navigation.getURL('dedicated', '#/billing/history/debt/all/pay', {}),
    [],
  );

  const viewBillsLink = useMemo(
    () =>
      navigation.getURL('dedicated', '#/billing/history', {
        // From BFF's code, it seems that period cannot be null or undefined, so this code could probably be simplified
        filter: bills?.period
          ? JSON.stringify(usePeriodFilter(bills.period))
          : '',
      }),
    [bills?.period],
  );

  const trackGoToBilling = () => {
    trackClick({
      actionType: 'action',
      actions: ['activity', 'billing', 'show-all'],
    });
  };

  return (
    <div data-testid="billing_summary" className="manager-hub-billing-summary">
      <OsdsText
        className="block mb-6"
        level={ODS_TEXT_LEVEL.subheading}
        size={ODS_TEXT_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('hub_billing_summary_title')}
      </OsdsText>
      {!isLoading && billsError && (
        <Suspense
          fallback={<OsdsSkeleton data-testid="tile_error_skeleton" inline />}
        >
          <TileError
            contrasted
            message={t('hub_billing_summary_display_bills_error')}
            refetch={refetch}
          />
        </Suspense>
      )}
      {!billsError && (
        <div>
          <OsdsSelect
            data-testid="bills_period_selector"
            className="w-full m-auto max-w-60 px-4 box-border"
            value={months}
            onOdsValueChange={(event) =>
              setMonths(Number(event.detail.value as string))
            }
          >
            {BILLING_SUMMARY_PERIODS_IN_MONTHS.map((month) => (
              <OsdsSelectOption
                data-testid={`months_period_option_${month}`}
                key={`months_period_option_${month}`}
                value={month}
              >
                {t(`hub_billing_summary_period_${month}`)}
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          <span
            data-testid="bills_amount_container"
            className="block whitespace-nowrap manager-hub-billing-summary__bill-total"
          >
            {!isLoading && formattedPrice}
          </span>
          <p className="mt-6">
            {isLoading && (
              <OsdsSkeleton
                data-testid="bills_status_skeleton"
                size={ODS_SKELETON_SIZE.sm}
                inline
              />
            )}
            {!isLoading && bills?.total > 0 && debt?.dueAmount?.value === 0 && (
              <>
                <OsdsIcon
                  className="align-middle mr-4"
                  name={ODS_ICON_NAME.SUCCESS_CIRCLE}
                  size={ODS_ICON_SIZE.sm}
                  contrasted
                ></OsdsIcon>
                <span>{t('hub_billing_summary_debt_null')}</span>
              </>
            )}
            {!isLoading && debt?.dueAmount?.value > 0 && (
              <>
                <span data-testid="debt_amount">
                  {t('hub_billing_summary_debt', {
                    debt: formattedDebtPrice,
                  })}
                </span>
                <Suspense
                  fallback={<OsdsSkeleton data-testid="debt_link_skeleton" />}
                >
                  <Await
                    resolve={payDebtLink}
                    children={(link: string) => (
                      <OsdsLink
                        data-testid="debt_link"
                        className="block"
                        href={link}
                        rel={OdsHTMLAnchorElementRel.noreferrer}
                        target={OdsHTMLAnchorElementTarget._blank}
                        contrasted
                      >
                        <span>{t('hub_billing_summary_debt_pay')}</span>
                      </OsdsLink>
                    )}
                  />
                </Suspense>
              </>
            )}
            {!isLoading &&
              bills?.total === 0 &&
              t('hub_billing_summary_debt_no_bills')}
          </p>
          {isLoading && (
            <OsdsSkeleton
              data-testid="bills_link_skeleton"
              size={ODS_SKELETON_SIZE.sm}
              inline
            />
          )}
          {!isLoading && (
            <Suspense
              fallback={<OsdsSkeleton data-testid="bills_link_skeleton" />}
            >
              <Await
                resolve={viewBillsLink}
                children={(link: string) => (
                  <OsdsLink
                    data-testid="bills_link"
                    className="mt-6"
                    href={link}
                    onClick={trackGoToBilling}
                    target={OdsHTMLAnchorElementTarget._top}
                    contrasted
                  >
                    {t('hub_billing_summary_display_bills')}
                    <span className="ml-4" slot="end">
                      <OsdsIcon
                        name={ODS_ICON_NAME.ARROW_RIGHT}
                        size={ODS_ICON_SIZE.sm}
                        contrasted
                      ></OsdsIcon>
                    </span>
                  </OsdsLink>
                )}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
