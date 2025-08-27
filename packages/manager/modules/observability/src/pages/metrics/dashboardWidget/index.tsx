import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OdsButton, OdsModal, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useHideOdsModalHeader } from '../../../hooks';
import './styles.css';

const DashboardWidgetModal = () => {
  const ref = useHideOdsModalHeader<HTMLOdsModalElement>();

  const navigate = useNavigate();

  const { widgetId } = useParams();

  const onDismiss = () => {
    navigate('..');
  };

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
            <OdsText preset="heading-3">{widgetId}</OdsText>
          </div>
        </div>
        <slot name="content">
          <span>Chart placeholder here</span>
        </slot>

        <slot name="footer">
          <div className="flex justify-between">
            <div>
              <span>Action placeholder here</span>
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
