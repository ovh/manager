import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import InstanceList from './InstanceList.component';
import {
  priceToUcent,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';

type MonthlyConsumptionProps = {
  consumption: TConsumptionDetail;
};

export default function MonthlyConsumption({
  consumption,
}: Readonly<MonthlyConsumptionProps>) {
  const { t } = useTranslation('consumption/monthly-instance');

  const { getTextPrice } = useCatalogPrice(2);
  const instancePriceWithCurrency = getTextPrice(
    priceToUcent(consumption?.totals.monthly?.instance ?? 0),
  );

  return (
    <OsdsAccordion>
      <OsdsText
        size={ODS_TEXT_SIZE._500}
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot="summary"
        className="my-2"
      >
        {`${t(
          'cpbc_monthly_instance_detail_title',
        )} ${instancePriceWithCurrency}`}
      </OsdsText>
      <InstanceList
        billingInstances={consumption?.monthlyInstances}
        colNameLabel={t('cpbc_monthly_instance_col_name')}
        colTotalLabel={t('cpbc_monthly_instance_col_total')}
        isMonthlyInstances
        showAdditionalInstanceDetails
      />
    </OsdsAccordion>
  );
}
