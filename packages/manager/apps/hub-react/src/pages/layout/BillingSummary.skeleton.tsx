import { useState } from 'react';
import {
  OsdsSelect,
  OsdsSelectOption,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import '@/pages/layout/BillingSummary.style.scss';
import { BILLING_SUMMARY_PERIODS_IN_MONTHS } from '@/pages/layout/layout.constants';

export default function BillingSummarySkeleton() {
  const { t } = useTranslation('hub/billing');
  const [months] = useState(1);

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
      <div>
        <OsdsSelect
          data-testid="bills_period_selector"
          className="w-full m-auto max-w-60 px-4 box-border"
          value={months}
          disabled={true}
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
        <OsdsSkeleton
          className="manager-hub-billing-summary__bill-total"
          inline
        ></OsdsSkeleton>
        <p className="mt-6">
          <OsdsSkeleton
            data-testid="bills_status_skeleton"
            size={ODS_SKELETON_SIZE.sm}
            inline
          />
        </p>
        <OsdsSkeleton
          data-testid="bills_link_skeleton"
          size={ODS_SKELETON_SIZE.sm}
          inline
        />
      </div>
    </div>
  );
}
