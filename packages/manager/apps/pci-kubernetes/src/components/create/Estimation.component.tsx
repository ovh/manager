import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { NodePoolPrice } from '@/api/data/kubernetes';

const Estimation = ({ nodePools }: { nodePools?: NodePoolPrice[] }) => {
  const { t } = useTranslation('node-pool');
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });

  return (
    <div className="flex flex-col gap-6 mb-8">
      <OsdsText
        className="font-bold"
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        slot="end"
      >
        {t('kube_common_node_pool_estimated_cost')}
      </OsdsText>
      {region !== 'US' && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kube_common_node_pool_estimation_text')}
        </OsdsText>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t('kube_common_node_pool_estimation_price', {
          estimation: nodePools
            ? getFormattedMonthlyCatalogPrice(
                nodePools.reduce(
                  (acc, item) => acc + item.monthlyPrice,

                  0,
                ),
              )
            : getFormattedMonthlyCatalogPrice(0),
        })}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        {t('kube_common_node_pool_estimation_text_end')}
      </OsdsText>
    </div>
  );
};

export default Estimation;
