import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useChartWithData } from '../../../data/hooks';
import { useHideOdsModalHeader } from '../../../hooks';
import { ObsTimeControls } from '../../../components';
import { ChartRenderer } from '../../../components/obsCharts';
import './styles.css';

const DashboardWidgetModal = () => {
  const ref = useHideOdsModalHeader<HTMLOdsModalElement>();

  const navigate = useNavigate();

  const { widgetId } = useParams();

  const { isLoading, config, data } = useChartWithData(widgetId);

  const onDismiss = () => {
    navigate('..');
  };

  if (!config) {
    return (
      <OdsMessage className="m-4" color={ODS_MESSAGE_COLOR.warning}>
        <span>No config found. Please check your configuration</span>
      </OdsMessage>
    );
  }

  const { id, title, chart } = config;

  return (
    <OdsModal
      ref={ref}
      isDismissible={!!onDismiss}
      className="text-left"
      hidden={true}
      color={ODS_MODAL_COLOR.information}
      onOdsClose={onDismiss}
      isOpen={true}
    >
      <>
        <div className="flex items-center gap-4">
          <div>
            <OdsText preset="heading-3">{title}</OdsText>
          </div>
          <div className="ml-auto flex justify-end gap-4">
            {isLoading ? null : <ObsTimeControls />}
          </div>
        </div>
        <slot name="content">
          {isLoading ? (
            <div data-testid="spinner" className="flex justify-center my-5">
              <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
            </div>
          ) : (
            <div className="w-full chart-component-wrapper flex flex-col text-left">
              <ChartRenderer
                type={chart.type}
                chart={chart}
                id={id}
                title={title}
                data={data ?? []}
                isLoading={false}
                isFullscreen={true}
              />
            </div>
          )}
        </slot>

        <slot name="footer">
          <div className="flex justify-between">
            <div>
              {isLoading ? null : (
                <OdsButton
                  label={'Analyse in AllMetrics'}
                  color="primary"
                  variant={ODS_BUTTON_VARIANT.outline}
                  isDisabled={isLoading}
                  slot="actions"
                />
              )}
            </div>

            <div>
              <OdsButton
                label={'Close'}
                color="primary"
                variant={ODS_BUTTON_VARIANT.outline}
                onClick={onDismiss}
                slot="actions"
              />
            </div>
          </div>
        </slot>
      </>
    </OdsModal>
  );
};
export default DashboardWidgetModal;
