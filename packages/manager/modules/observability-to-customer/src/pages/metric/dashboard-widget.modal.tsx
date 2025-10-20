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

import { TimeControls } from '../../components';
import { ChartRenderer } from '../../components/charts/base';
import { useDashboardContext } from '../../contexts';
import { useChartWithData } from '../../data/hooks/dashboards/useChartWithData';
import './styles.css';

const DashboardWidgetModal = <TData,>() => {
  const { t } = useTranslation('observability-dashboards');

  const navigate = useNavigate();

  const { resourceName, productType, widgetId } = useParams();

  const { state } = useDashboardContext();

  const { startDateTime, endDateTime, selectedTimeOption, refreshInterval } = state;

  const { isLoading, config, data } = useChartWithData<TData>({
    chartId: widgetId as string,
    resourceName: resourceName ?? '',
    productType: productType ?? '',
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
  });

  const onDismiss = () => {
    navigate('..');
  };
  const onOpenChange = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      onDismiss();
    }
  };

  const onStateChange = <TValue,>(key: string, value: TValue) => {
    // TODO
    console.log(key);
    console.log(value);
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
            <TimeControls isLoading={isLoading} state={state} onStateChange={onStateChange} />
          </div>
        </div>
        <ModalBody>
          {isLoading ? (
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
                state={state}
              />
            </div>
          )}
          <div className="flex justify-between">
            <div>
              {isLoading ? null : (
                <Button
                  color="primary"
                  variant={BUTTON_VARIANT.outline}
                  disabled={isLoading}
                  slot="actions"
                >
                  {t('dashboard_widget_analyse_in_all_metrics')}
                </Button>
              )}
            </div>

            <div>
              <Button
                color="primary"
                variant={BUTTON_VARIANT.outline}
                onClick={onDismiss}
                slot="actions"
              >
                {t('dashboard_widget_close')}
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default DashboardWidgetModal;
