import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { OsdsAccordion, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TConsumptionDetail } from '@/api/hook/useConsumption';
import SavingsPlanList from './SavingsPlanList.component';

type SavingsPlanConsumptionProps = {
  consumption: TConsumptionDetail;
};

export default function SavingsPlanConsumption({
  consumption,
}: Readonly<SavingsPlanConsumptionProps>) {
  const { t } = useTranslation('consumption/monthly-instance');
  const { currency } = useContext(ShellContext).environment.getUser();

  const svpTotalPrice = `(${consumption?.totals.monthly?.savingsPlan?.toFixed(
    2,
  )} ${currency.symbol})`;

  return (
    <OsdsAccordion>
      <OsdsText
        size={ODS_TEXT_SIZE._500}
        level={ODS_TEXT_LEVEL.subheading}
        color={ODS_THEME_COLOR_INTENT.primary}
        slot="summary"
        className="my-2"
      >
        {`${t('Savings Plan')} ${svpTotalPrice}`}
      </OsdsText>
      <SavingsPlanList
        monthlySavingsPlanList={consumption?.monthlySavingsPlanList}
      />
    </OsdsAccordion>
  );
}
