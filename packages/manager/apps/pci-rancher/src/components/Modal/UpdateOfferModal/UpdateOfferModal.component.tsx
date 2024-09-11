import {
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsText,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';
import Modal from '../Modal.component';
import {
  useTrackingAction,
  useTrackingPage,
} from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';

export interface PlanInfo {
  name: string;
  price: string;
}

export interface UpdateOfferModalProps {
  onClose: () => void;
  onClickUpdate: () => void;
  isUpdatePending: boolean;
  planInfo: PlanInfo;
}

const UpdateOfferModal: FC<UpdateOfferModalProps> = ({
  onClose,
  onClickUpdate,
  isUpdatePending,
  planInfo,
}) => {
  const { t } = useTranslation(['dashboard']);
  const trackAction = useTrackingAction();
  useTrackingPage(TrackingPageView.UpdateOfferModal);

  const onUpdate = () => {
    trackAction(TrackingPageView.UpdateOfferModal, TrackingEvent.confirm);
    onClickUpdate();
    onClose();
  };

  const onCloseModal = () => {
    trackAction(TrackingPageView.UpdateOfferModal, TrackingEvent.cancel);
    onClose();
  };

  return (
    <Modal color={ODS_THEME_COLOR_INTENT.info} onClose={onClose}>
      {!isUpdatePending ? (
        <>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            className="my-3"
          >
            {t('updateOfferModaleTitle')}
          </OsdsText>
          {
            <div className="mt-3">
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {t('updateOfferModalDescription', {
                  availableServicePlan: planInfo.name,
                  planPricing: planInfo.price,
                })}
              </OsdsText>
            </div>
          }

          <OsdsButton
            slot="actions"
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onCloseModal}
          >
            {t('updateOfferModalCancelButton')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            color={ODS_THEME_COLOR_INTENT.primary}
            aria-label="update-offer-rancher"
            onClick={onUpdate}
          >
            {t('updateOfferModalValidateButton')}
          </OsdsButton>
        </>
      ) : (
        <div className="max-w-3xl">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
        </div>
      )}
    </Modal>
  );
};

export default UpdateOfferModal;
