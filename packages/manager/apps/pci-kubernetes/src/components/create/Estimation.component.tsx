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
import { NodePoolPrice } from '@/api/data/kubernetes';
import useSavingsPlanAvailable from '@/hooks/useSavingPlanAvailable';
import use3AZPlanAvailable from '@/hooks/use3azPlanAvaible';
import { TClusterCreationForm } from '@/pages/new/useCusterCreationStepper';

type EstimationProps = {
  nodePools?: NodePoolPrice[];
  plan: TClusterCreationForm['plan'];
};

const Estimation = ({ nodePools, plan }: EstimationProps) => {
  const { t } = useTranslation('node-pool');

  const { getFormattedMonthlyCatalogPrice } = useCatalogPrice(4, {
    exclVat: true,
  });
  const showSavingPlan = useSavingsPlanAvailable();
  const has3AZ = use3AZPlanAvailable();

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
      {showSavingPlan && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kube_common_node_pool_estimation_text')}
        </OsdsText>
      )}
      {has3AZ && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          <strong> {t('kube_common_cluster_estimation_price')}</strong>{' '}
          {t(
            plan === 'standard'
              ? 'kube_common_estimation_price'
              : 'kube_common_estimation_price_free',
          )}
        </OsdsText>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
      >
        <strong>{t('kube_common_node_pool_estimation_price')}</strong>{' '}
        {nodePools
          ? getFormattedMonthlyCatalogPrice(
              nodePools.reduce(
                (acc, item) => acc + item.monthlyPrice,

                0,
              ),
            )
          : getFormattedMonthlyCatalogPrice(0)}
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
