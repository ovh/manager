import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  MODAL_COLOR,
  Message,
  Modal,
  ModalBody,
  ModalContent,
  ModalOpenChangeDetail,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES as COMMON_NAMESPACES } from '@ovh-ux/manager-common-translations';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { TimeControls } from '@/components';
import { ChartRenderer } from '@/components/charts/base';

import { useDashboardContext, useMetricsToCustomerContext } from '@/contexts';

import { useChartWithData, useMetricToken } from '@/data/hooks';

import '@/pages/metrics/styles.scss';

const DashboardWidgetModal = <TData,>() => {
  const { t } = useTranslation([NAMESPACES.DASHBOARDS, COMMON_NAMESPACES.ACTIONS]);

  const navigate = useNavigate();

  const { widgetId } = useParams();

  const { state } = useMetricsToCustomerContext();

  const { state : dashboardState, setState : setDashboardState } = useDashboardContext();

  const resourceName = state.resourceName ?? '';
  const productType = state.productType ?? '';
  const resourceURN = state.resourceURN ?? '';

  const { data: metricToken, isLoading: isMetricTokenLoading } = useMetricToken({resourceName});

  const { 
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
  } = dashboardState;

  const { isLoading, config, data, refetch, cancel } = useChartWithData<TData>({
    chartId: widgetId as string,
    resourceName: resourceName,
    productType: productType,
    resourceURN: resourceURN,
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
    metricToken: metricToken ?? '',
  });

  const globalLoading = useMemo(() => isMetricTokenLoading || isLoading, [isMetricTokenLoading, isLoading]);

  const onDismiss = () => {
    navigate('..');
  };
  const onOpenChange = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      onDismiss();
    }
  };

  const onStateChange = <TValue,>(key: string, value: TValue) => {
    setDashboardState({ ...dashboardState, [key]: value });
  };

  if (!config) {
    return (
      <Message className="m-4" color={MESSAGE_COLOR.warning}>
        <span>{t('dashboard_widget_config_not_found')}</span>
      </Message>
    );
  }

  const { id, title, chart } = config;

  return (
    <Modal onOpenChange={onOpenChange} open={true}>
      <ModalContent
        id="dashboard-widget-modal-content"
        dismissible={false}
        color={MODAL_COLOR.neutral}
        className="pt-5 px-5 text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <Text preset={TEXT_PRESET.heading3}>{title}</Text>
          </div>
          <div className="ml-auto flex justify-end gap-4">
            <TimeControls isLoading={globalLoading} state={dashboardState} onStateChange={onStateChange} onRefresh={refetch} onCancel={cancel} />
          </div>
        </div>
        <ModalBody>
          {globalLoading ? (
            <div data-testid="spinner" className="flex justify-center my-5">
              <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
            </div>
          ) : (
            <div className="w-full chart-component-wrapper flex flex-col text-left">
              <ChartRenderer<TData>
                type={chart.type}
                chartConfig={chart}
                id={id}
                title={title}
                data={data ?? []}
                isLoading={false}
                isFullscreen={true}
                state={dashboardState}
              />
            </div>
          )}
          <div className="flex justify-end">
            <div>
              <Button
                color="primary"
                variant={BUTTON_VARIANT.outline}
                onClick={onDismiss}
                slot="actions"
              >
                {t(`${COMMON_NAMESPACES.ACTIONS}:close`)}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DashboardWidgetModal;
