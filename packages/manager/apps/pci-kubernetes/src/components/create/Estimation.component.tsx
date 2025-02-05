import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

const Estimation = ({
  price = 0,
  monthlyPrice = 0,
}: {
  price?: number;
  monthlyPrice?: number;
}) => {
  const { t } = useTranslation('node-pool');
  const {
    getFormattedMonthlyCatalogPrice,
    getFormattedHourlyCatalogPrice,
  } = useCatalogPrice(4, { exclVat: true });

  return (
    <div className="flex flex-col gap-4">
      <OsdsText
        className="ml-4 font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        slot="end"
      >
        {t('kube_common_node_pool_estimated_cost')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {getFormattedHourlyCatalogPrice(price)}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {getFormattedMonthlyCatalogPrice(monthlyPrice)}
      </OsdsText>
    </div>
  );
};

export default Estimation;
