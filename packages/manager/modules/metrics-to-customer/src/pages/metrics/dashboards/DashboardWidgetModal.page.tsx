import { Suspense, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
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

import { useNamespaceTranslation } from '@/hooks';

const DashboardWidgetModal = <TData,>() => {
  const { t } = useTranslation([NAMESPACES.DASHBOARDS, COMMON_NAMESPACES.ACTIONS]);
  const tDashboardTexts = useNamespaceTranslation(NAMESPACES.DASHBOARD_TEXTS);

  const navigate = useNavigate();

  const { widgetId } = useParams();

  const { state: { resourceName, productType, resourceURN, regions, } } = useMetricsToCustomerContext();
  const { code: regionCode = '', label: regionLabel = '' } = regions[0] ?? {};

  const { state: dashboardState, setState: setDashboardState } = useDashboardContext();

  const { data: metricToken, isLoading: isMetricTokenLoading } = useMetricToken({ resourceName });

  const {
    startDateTime,
    endDateTime,
    selectedTimeOption,
    refreshInterval,
    regionAvailable,
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
    regionCode,
    metricToken: metricToken ?? '',
    fetchData: regionAvailable,
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

    // Allow updating multiple fields at once when a composite key is used
    if (key === 'dateRange' && typeof value === 'object' && value !== null) {
      setDashboardState((prevState) => ({
        ...prevState,
        ...(value as Partial<typeof prevState>),
      }));
      return;
    }

    // Default behaviour: update a single key
    setDashboardState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
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
    <Suspense>
      <Modal
        onOpenChange={onOpenChange}
        closeOnInteractOutside={false}
        open={true}
        backdropStyle={{
          zIndex: 97
        }}
        positionerStyle={{
          zIndex: 98
        }}
        data-modal-type="dashboard-widget">
        <ModalContent
          dismissible={false}
          className="pt-5 px-5 text-left m-auto max-w-[calc(100vw-128px)] max-h-[calc(100vh-128px)]">
          <div className="flex items-center gap-4">
            <div>
              <Text preset={TEXT_PRESET.heading3}>{tDashboardTexts(title)}</Text>
            </div>
            <div className="ml-auto flex justify-end gap-4">
              <TimeControls id="widget-time-controls" isLoading={globalLoading} state={dashboardState} onStateChange={onStateChange} onRefresh={refetch} onCancel={cancel} disabled={!regionAvailable} />
            </div>
          </div>

          {
            !regionAvailable && (
              <Message className='w-full mt-8' color="warning" dismissible={false}>
                <MessageIcon name="triangle-exclamation" />
                <MessageBody>
                  <Text preset={TEXT_PRESET.paragraph}>
                    {t(`${NAMESPACES.MODULE}:metrics_region_not_available`, { region: regionLabel })}
                  </Text>
                </MessageBody>
              </Message>
            )
          }

          <ModalBody className='mx-0 px-0'>
            {
              regionAvailable ? <>
                {
                  globalLoading ? <div data-testid="spinner" className="flex justify-center my-5">
                    <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
                  </div>
                    : (
                      <div className="w-full h-[calc(100vh-256px)] flex flex-col text-left">
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
                    )
                }
              </>
                : null
            }
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
    </Suspense>
  );
};
export default DashboardWidgetModal;
